# Using Generated SDKs

This document provides guidance on how to use the generated SDKs in different frontend frameworks.

## Angular Implementation

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ApiModule, Configuration, ConfigurationParameters } from './api';

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    basePath: 'http://localhost:3000',
    accessToken: () => localStorage.getItem('access_token') || ''
  };
  return new Configuration(params);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ApiModule.forRoot(apiConfigFactory)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

// Using the API in a component
import { Component, OnInit } from '@angular/core';
import { AuthService, User } from './api';

@Component({
  selector: 'app-login',
  template: `
    <form (submit)="login()">
      <input [(ngModel)]="email" type="email" placeholder="Email" required>
      <input [(ngModel)]="password" type="password" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>
  `
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';

  constructor(private authService: AuthService) {}

  login(): void {
    this.authService.login({ email: this.email, password: this.password })
      .subscribe(
        (response) => {
          localStorage.setItem('access_token', response.access_token);
          localStorage.setItem('refresh_token', response.refresh_token);
          // Navigate to home page or dashboard
        },
        (error) => {
          console.error('Login failed', error);
        }
      );
  }
}
```

## React Implementation

```typescript
// api.config.ts
import { SunestApi } from './api';

// Create API instance
const api = new SunestApi({
  BASE: 'http://localhost:3000',
  TOKEN: () => localStorage.getItem('access_token') || '',
});

export default api;

// Login.tsx
import React, { useState } from 'react';
import api from './api.config';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.auth.login({ email, password });
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      // Redirect to dashboard or home page
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
```

## TypeScript (Generic) Implementation

```typescript
// api.ts
import { Api } from './api';

// Create API instance
const api = new Api({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
  securityWorker: (securityData) => {
    return {
      headers: {
        Authorization: `Bearer ${securityData}`,
      },
    };
  },
});

// Set token after login
export const setAuthToken = (token: string) => {
  api.setSecurityData(token);
};

export default api;

// login.ts
import api, { setAuthToken } from './api';

async function login(email: string, password: string) {
  try {
    const response = await api.auth.login({ email, password });
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    setAuthToken(response.data.access_token);
    return response.data;
  } catch (error) {
    console.error('Login failed', error);
    throw error;
  }
}

export { login };
```

## Flutter Implementation

```dart
// api_client.dart
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:sunest_api/api.dart';

class ApiClient {
  late DefaultApi api;
  final storage = FlutterSecureStorage();

  ApiClient() {
    final dio = Dio();
    
    // Add authorization interceptor
    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await storage.read(key: 'access_token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (DioError error, handler) async {
        if (error.response?.statusCode == 401) {
          // Handle token refresh if needed
          final refreshToken = await storage.read(key: 'refresh_token');
          if (refreshToken != null) {
            try {
              // Refresh token logic
              // ...
              // Retry the original request
              return handler.resolve(await dio.fetch(error.requestOptions));
            } catch (e) {
              // Handle refresh token failure
            }
          }
        }
        return handler.next(error);
      },
    ));

    final apiClient = ApiClient(dio: dio, baseUrl: 'http://localhost:3000');
    api = DefaultApi(apiClient);
  }

  Future<LoginResponse> login(String email, String password) async {
    try {
      final response = await api.login(LoginDto(email: email, password: password));
      await storage.write(key: 'access_token', value: response.accessToken);
      await storage.write(key: 'refresh_token', value: response.refreshToken);
      return response;
    } catch (e) {
      rethrow;
    }
  }
}

// login_screen.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:sunest_app/api_client.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  String? _errorMessage;

  @override
  Widget build(BuildContext context) {
    final apiClient = Provider.of<ApiClient>(context);

    return Scaffold(
      appBar: AppBar(title: Text('Login')),
      body: Form(
        key: _formKey,
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Column(
            children: [
              if (_errorMessage != null)
                Text(_errorMessage!, style: TextStyle(color: Colors.red)),
              TextFormField(
                controller: _emailController,
                decoration: InputDecoration(labelText: 'Email'),
                keyboardType: TextInputType.emailAddress,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your email';
                  }
                  return null;
                },
              ),
              TextFormField(
                controller: _passwordController,
                decoration: InputDecoration(labelText: 'Password'),
                obscureText: true,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your password';
                  }
                  return null;
                },
              ),
              SizedBox(height: 20),
              ElevatedButton(
                onPressed: _isLoading
                    ? null
                    : () async {
                        if (_formKey.currentState!.validate()) {
                          setState(() {
                            _isLoading = true;
                            _errorMessage = null;
                          });

                          try {
                            await apiClient.login(
                              _emailController.text,
                              _passwordController.text,
                            );
                            Navigator.pushReplacementNamed(context, '/home');
                          } catch (e) {
                            setState(() {
                              _errorMessage = 'Login failed. Please check your credentials.';
                            });
                          } finally {
                            if (mounted) {
                              setState(() {
                                _isLoading = false;
                              });
                            }
                          }
                        }
                      },
                child: _isLoading ? CircularProgressIndicator() : Text('Login'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }
}
```

## Handling Common Scenarios

### Token Refresh

All SDKs should implement token refresh logic to handle expired access tokens:

1. Detect 401 Unauthorized responses
2. Use the refresh token to obtain a new access token
3. Retry the original request with the new token
4. If refresh fails, log the user out

### Error Handling

Implement consistent error handling across all platforms:

1. API errors (4xx, 5xx)
2. Network errors
3. Validation errors from the API

### API Response Structure

The Sunest API returns consistent responses:

- Success responses include the requested data
- Error responses include an error message and sometimes a validation error object
- For paginated endpoints, responses include metadata (total, page, limit)

### Authentication Flow

1. Login and store tokens (access_token, refresh_token)
2. Include access_token in all authenticated requests
3. Implement automatic token refresh
4. Provide logout functionality that clears tokens