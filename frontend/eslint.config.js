import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';   
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';    
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'coverage']),
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],

    plugins: {
      react,             
      'react-hooks': reactHooks, 
      import: importPlugin, 
      'jsx-a11y': jsxA11y, 
    },

    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],

    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.es2021,  
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true, 
        },
      },
    },

    settings: {
      react: {
        version: 'detect', 
      },
      'import/resolver': {
        typescript: true, 
        node: true,       
      },
    },

    rules: {
      'react/react-in-jsx-scope': 'off', 
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      
      'import/order': [
        'error', 
        {
          groups: [
            'builtin',    
            'external',   
            'internal',   
            'parent',     
            'sibling',    
            'index',      
          ],
          'newlines-between': 'always', 
          alphabetize: { 
            order: 'asc', 
            caseInsensitive: true 
          },
        },
      ],
      'semi': ['error', 'always'],

      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',   
        varsIgnorePattern: '^_'      
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/aria-props': 'warn',  
      'jsx-a11y/aria-role': 'warn',

      'no-console': ['warn', { allow: ['warn', 'error'] }],
      
      'prefer-const': 'error',
    },
  },

  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    
    languageOptions: {
      globals: {
        ...globals.jest, 
        ...globals.node,  
      },
    },
    
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', 
    },
  },
]);