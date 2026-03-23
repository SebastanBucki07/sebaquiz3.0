import { TestBed } from '@angular/core/testing';
import { QuestionClassifierService } from './question-classifier.service';
import { Question } from '../../shared/questions/question.interface';

describe('QuestionClassifierService', () => {
  let service: QuestionClassifierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionClassifierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('needsHints', () => {
    it('should return true if question text contains "obsada"', () => {
      const mockQuestion = { question: 'Jaka to obsada?' } as Question;
      expect(service.needsHints(mockQuestion)).toBeTrue();
    });

    it('should return true if question text contains "zagrała taka obsada"', () => {
      const mockQuestion = { question: 'W jakim filmie zagrała taka obsada?' } as Question;
      expect(service.needsHints(mockQuestion)).toBeTrue();
    });

    it('should be case-insensitive', () => {
      const mockQuestion = { question: 'OBSADA' } as Question;
      expect(service.needsHints(mockQuestion)).toBeTrue();
    });

    it('should return false for regular questions', () => {
      const mockQuestion = { question: 'Kto jest na zdjęciu?' } as Question;
      expect(service.needsHints(mockQuestion)).toBeFalse();
    });

    it('should return false if question text is empty or null', () => {
      const mockQuestion = { question: '' } as Question;
      expect(service.needsHints(mockQuestion)).toBeFalse();
    });
  });
});
