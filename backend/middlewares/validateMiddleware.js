/**
 * Custom request validation middleware matching schema configurations
 */
export const validate = (rules) => {
  return (req, res, next) => {
    const errors = [];

    for (const [source, fields] of Object.entries(rules)) {
      const data = req[source];
      if (!data) {
        errors.push(`Missing request ${source}`);
        continue;
      }

      for (const [field, constraints] of Object.entries(fields)) {
        const value = data[field];

        if (constraints.required && (value === undefined || value === null || value === '')) {
          errors.push(`Field '${field}' in request ${source} is required`);
          continue;
        }

        if (value !== undefined && value !== null && value !== '') {
          if (constraints.type === 'email' && !/\S+@\S+\.\S+/.test(value)) {
            errors.push(`Field '${field}' in request ${source} must be a valid email`);
          }
          if (constraints.type === 'string' && typeof value !== 'string') {
            errors.push(`Field '${field}' in request ${source} must be a string`);
          }
          if (constraints.minLength && value.length < constraints.minLength) {
            errors.push(`Field '${field}' in request ${source} must be at least ${constraints.minLength} characters`);
          }
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    next();
  };
};

// Common validation schemas
export const registerSchema = {
  body: {
    name: { required: true, type: 'string' },
    email: { required: true, type: 'email' },
    password: { required: true, type: 'string', minLength: 6 }
  }
};

export const loginSchema = {
  body: {
    email: { required: true, type: 'email' },
    password: { required: true, type: 'string' }
  }
};

export const changePasswordSchema = {
  body: {
    currentPassword: { required: true, type: 'string' },
    newPassword: { required: true, type: 'string', minLength: 6 }
  }
};
