import {
  required,
  minLength,
  maxLength,
  positiveNumber,
  isUrl,
  isEmail,
  validate,
  validateForm,
} from '@shared/lib/validation/validators';

describe('Validators', () => {
  describe('required', () => {
    it('возвращает ошибку для пустой строки', () => {
      const validator = required('Поле обязательно');
      expect(validator('')).toBe('Поле обязательно');
    });

    it('возвращает ошибку для строки из пробелов', () => {
      const validator = required('Поле обязательно');
      expect(validator('   ')).toBe('Поле обязательно');
    });

    it('возвращает null для валидного значения', () => {
      const validator = required('Поле обязательно');
      expect(validator('test')).toBeNull();
    });
  });

  describe('minLength', () => {
    it('возвращает ошибку для короткой строки', () => {
      const validator = minLength(5);
      expect(validator('test')).toBeTruthy();
    });

    it('возвращает null для валидной строки', () => {
      const validator = minLength(5);
      expect(validator('testing')).toBeNull();
    });

    it('использует кастомное сообщение', () => {
      const customMessage = 'Слишком короткая строка';
      const validator = minLength(5, customMessage);
      expect(validator('test')).toBe(customMessage);
    });
  });

  describe('maxLength', () => {
    it('возвращает ошибку для длинной строки', () => {
      const validator = maxLength(5);
      expect(validator('testing')).toBeTruthy();
    });

    it('возвращает null для валидной строки', () => {
      const validator = maxLength(5);
      expect(validator('test')).toBeNull();
    });
  });

  describe('positiveNumber', () => {
    it('возвращает ошибку для нуля', () => {
      const validator = positiveNumber();
      expect(validator(0)).toBeTruthy();
    });

    it('возвращает ошибку для отрицательного числа', () => {
      const validator = positiveNumber();
      expect(validator(-5)).toBeTruthy();
    });

    it('возвращает null для положительного числа', () => {
      const validator = positiveNumber();
      expect(validator(5)).toBeNull();
    });
  });

  describe('isUrl', () => {
    it('возвращает ошибку для невалидного URL', () => {
      const validator = isUrl();
      expect(validator('not-a-url')).toBeTruthy();
    });

    it('возвращает null для валидного URL', () => {
      const validator = isUrl();
      expect(validator('https://example.com')).toBeNull();
    });

    it('возвращает null для пустой строки', () => {
      const validator = isUrl();
      expect(validator('')).toBeNull();
    });
  });

  describe('isEmail', () => {
    it('возвращает ошибку для невалидного email', () => {
      const validator = isEmail();
      expect(validator('not-an-email')).toBeTruthy();
    });

    it('возвращает null для валидного email', () => {
      const validator = isEmail();
      expect(validator('test@example.com')).toBeNull();
    });

    it('возвращает null для пустой строки', () => {
      const validator = isEmail();
      expect(validator('')).toBeNull();
    });
  });

  describe('validate', () => {
    it('возвращает первую ошибку из правил', () => {
      const rules = [required('Обязательно'), minLength(5, 'Минимум 5')];
      expect(validate('', rules)).toBe('Обязательно');
    });

    it('возвращает null если все правила пройдены', () => {
      const rules = [required('Обязательно'), minLength(5, 'Минимум 5')];
      expect(validate('testing', rules)).toBeNull();
    });
  });

  describe('validateForm', () => {
    it('возвращает ошибки для невалидных полей', () => {
      const data = {
        name: '',
        email: 'invalid',
        age: -5,
      };

      const schema = {
        name: [required('Имя обязательно')],
        email: [isEmail('Невалидный email')],
        age: [positiveNumber('Возраст должен быть положительным')],
      };

      const result = validateForm(data, schema);

      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBe('Имя обязательно');
      expect(result.errors.email).toBe('Невалидный email');
      expect(result.errors.age).toBe('Возраст должен быть положительным');
    });

    it('возвращает isValid: true для валидных данных', () => {
      const data = {
        name: 'John',
        email: 'john@example.com',
        age: 25,
      };

      const schema = {
        name: [required('Имя обязательно')],
        email: [isEmail('Невалидный email')],
        age: [positiveNumber('Возраст должен быть положительным')],
      };

      const result = validateForm(data, schema);

      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });
  });
});
