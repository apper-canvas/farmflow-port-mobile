import routesConfig from './routes.json';

// Custom functions object - MUST remain empty
const customFunctions = {};

/**
 * Get route configuration for a given path
 */
export const getRouteConfig = (path) => {
  // Normalize path
  const normalizedPath = path === '/' ? '/' : path.replace(/\/$/, '');
  
  // Find matching route configuration
  const routes = Object.keys(routesConfig);
  let bestMatch = null;
  let bestSpecificity = -1;
  
  for (const routePattern of routes) {
    if (matchesPattern(normalizedPath, routePattern)) {
      const specificity = getSpecificity(routePattern);
      if (specificity > bestSpecificity) {
        bestMatch = routePattern;
        bestSpecificity = specificity;
      }
    }
  }
  
  return bestMatch ? routesConfig[bestMatch] : null;
};

/**
 * Check if a path matches a route pattern
 */
export const matchesPattern = (path, pattern) => {
  // Exact match
  if (path === pattern) return true;
  
  // Handle index route
  if (pattern === '/' && path === '/') return true;
  
  // Parameter matching (:id)
  if (pattern.includes(':')) {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');
    
    if (patternParts.length !== pathParts.length) return false;
    
    return patternParts.every((part, index) => {
      return part.startsWith(':') || part === pathParts[index];
    });
  }
  
  // Wildcard matching
  if (pattern.endsWith('/**/*')) {
    const basePath = pattern.slice(0, -5); // Remove '/**/*'
    return path.startsWith(basePath);
  }
  
  if (pattern.endsWith('/*')) {
    const basePath = pattern.slice(0, -2); // Remove '/*'
    const remainingPath = path.slice(basePath.length);
    return path.startsWith(basePath) && !remainingPath.includes('/') && remainingPath.length > 0;
  }
  
  return false;
};

/**
 * Get specificity score for route pattern (higher = more specific)
 */
export const getSpecificity = (pattern) => {
  if (pattern === '/') return 1000; // Exact root match
  
  let score = 0;
  const parts = pattern.split('/').filter(Boolean);
  
  for (const part of parts) {
    if (part === '**' || part === '*') {
      score += 1; // Wildcard
    } else if (part.startsWith(':')) {
      score += 10; // Parameter
    } else {
      score += 100; // Exact match
    }
  }
  
  return score;
};

/**
 * Verify if user has access to a route
 */
export const verifyRouteAccess = (config, user) => {
  if (!config?.allow) {
    return { allowed: true, redirectTo: null, excludeRedirectQuery: false, failed: [] };
  }
  
  const { allow } = config;
  const { when, redirectOnDeny, excludeRedirectQuery = false } = allow;
  
  if (!when?.conditions) {
    return { allowed: true, redirectTo: null, excludeRedirectQuery: false, failed: [] };
  }
  
  const operator = when.operator || 'AND';
  const results = when.conditions.map(condition => evaluateCondition(condition, user));
  const failed = results.filter(r => !r.passed).map(r => r.label);
  
  let allowed;
  if (operator === 'OR') {
    allowed = results.some(r => r.passed);
  } else {
    allowed = results.every(r => r.passed);
  }
  
  return {
    allowed,
    redirectTo: allowed ? null : (redirectOnDeny || null),
    excludeRedirectQuery: excludeRedirectQuery || false,
    failed
  };
};

/**
 * Evaluate individual condition
 */
const evaluateCondition = (condition, user) => {
  const { rule, label } = condition;
  
  switch (rule) {
    case 'public':
      return { passed: true, label };
    
    case 'authenticated':
      return { passed: !!user, label };
    
    default:
      console.warn(`Unknown rule: ${rule}`);
      return { passed: false, label };
  }
};