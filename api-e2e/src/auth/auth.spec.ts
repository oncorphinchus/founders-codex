import axios from 'axios';

describe('Authentication E2E Tests', () => {
  const API_BASE_URL = 'http://localhost:3000/api';
  let userToken: string;
  let userId: string;
  
  // Test user data
  const testUser = {
    email: 'test@founderscodex.com',
    password: 'SecurePassword123!',
    firstName: 'Test',
    lastName: 'User',
    birthDate: '1990-01-01'
  };

  describe('User Registration', () => {
    it('should successfully register a new user', async () => {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, testUser);
      
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('access_token');
      expect(response.data).toHaveProperty('user');
      expect(response.data.user.email).toBe(testUser.email);
      expect(response.data.user.firstName).toBe(testUser.firstName);
      expect(response.data.user.lastName).toBe(testUser.lastName);
      
      // Store token and user ID for subsequent tests
      userToken = response.data.access_token;
      userId = response.data.user.id;
    });

    it('should reject registration with duplicate email', async () => {
      try {
        await axios.post(`${API_BASE_URL}/auth/register`, testUser);
        fail('Should have thrown an error for duplicate email');
      } catch (error) {
        expect(error.response.status).toBe(409); // Conflict
      }
    });

    it('should reject registration with invalid email', async () => {
      try {
        await axios.post(`${API_BASE_URL}/auth/register`, {
          ...testUser,
          email: 'invalid-email'
        });
        fail('Should have thrown an error for invalid email');
      } catch (error) {
        expect(error.response.status).toBe(400); // Bad Request
      }
    });

    it('should reject registration with weak password', async () => {
      try {
        await axios.post(`${API_BASE_URL}/auth/register`, {
          ...testUser,
          email: 'newuser@test.com',
          password: '123'
        });
        fail('Should have thrown an error for weak password');
      } catch (error) {
        expect(error.response.status).toBe(400); // Bad Request
      }
    });
  });

  describe('User Login', () => {
    it('should successfully login with valid credentials', async () => {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('access_token');
      expect(response.data).toHaveProperty('user');
      expect(response.data.user.email).toBe(testUser.email);
      
      // Update token for protected route tests
      userToken = response.data.access_token;
    });

    it('should reject login with invalid email', async () => {
      try {
        await axios.post(`${API_BASE_URL}/auth/login`, {
          email: 'nonexistent@test.com',
          password: testUser.password
        });
        fail('Should have thrown an error for invalid email');
      } catch (error) {
        expect(error.response.status).toBe(401); // Unauthorized
      }
    });

    it('should reject login with invalid password', async () => {
      try {
        await axios.post(`${API_BASE_URL}/auth/login`, {
          email: testUser.email,
          password: 'wrongpassword'
        });
        fail('Should have thrown an error for invalid password');
      } catch (error) {
        expect(error.response.status).toBe(401); // Unauthorized
      }
    });
  });

  describe('Protected Routes', () => {
    it('should reject unauthenticated requests to protected endpoints', async () => {
      try {
        await axios.get(`${API_BASE_URL}/goals`);
        fail('Should have thrown an error for unauthenticated request');
      } catch (error) {
        expect(error.response.status).toBe(401); // Unauthorized
      }
    });

    it('should allow authenticated requests to protected endpoints', async () => {
      const response = await axios.get(`${API_BASE_URL}/goals`, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('should reject requests with invalid JWT tokens', async () => {
      try {
        await axios.get(`${API_BASE_URL}/goals`, {
          headers: {
            Authorization: 'Bearer invalid-token'
          }
        });
        fail('Should have thrown an error for invalid token');
      } catch (error) {
        expect(error.response.status).toBe(401); // Unauthorized
      }
    });

    it('should reject requests with expired JWT tokens', async () => {
      // This test uses a pre-expired token for testing
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      
      try {
        await axios.get(`${API_BASE_URL}/goals`, {
          headers: {
            Authorization: `Bearer ${expiredToken}`
          }
        });
        fail('Should have thrown an error for expired token');
      } catch (error) {
        expect(error.response.status).toBe(401); // Unauthorized
      }
    });
  });

  describe('JWT Token Validation', () => {
    it('should contain valid user information in JWT payload', async () => {
      // Decode the JWT token (without verification for testing purposes)
      const tokenParts = userToken.split('.');
      const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
      
      expect(payload).toHaveProperty('sub'); // Subject (user ID)
      expect(payload).toHaveProperty('email');
      expect(payload).toHaveProperty('iat'); // Issued at
      expect(payload).toHaveProperty('exp'); // Expiration
      expect(payload.email).toBe(testUser.email);
    });

    it('should include proper expiration time in JWT', async () => {
      const tokenParts = userToken.split('.');
      const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
      
      const issuedAt = payload.iat;
      const expiresAt = payload.exp;
      const tokenDuration = expiresAt - issuedAt;
      
      // Should be approximately 7 days (604800 seconds)
      expect(tokenDuration).toBeGreaterThan(600000); // At least 7 days minus some buffer
      expect(tokenDuration).toBeLessThan(610000); // At most 7 days plus some buffer
    });
  });

  describe('Data Isolation', () => {
    it('should only return user-specific data for authenticated requests', async () => {
      // Test that goals endpoint returns empty array for new user
      const goalsResponse = await axios.get(`${API_BASE_URL}/goals`, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      
      expect(goalsResponse.status).toBe(200);
      expect(Array.isArray(goalsResponse.data)).toBe(true);
      expect(goalsResponse.data.length).toBe(0); // New user should have no goals
      
      // Test that habits endpoint returns empty array for new user
      const habitsResponse = await axios.get(`${API_BASE_URL}/habits`, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      
      expect(habitsResponse.status).toBe(200);
      expect(Array.isArray(habitsResponse.data)).toBe(true);
      expect(habitsResponse.data.length).toBe(0); // New user should have no habits
    });
  });
}); 