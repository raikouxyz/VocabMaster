import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Alert, Spinner } from 'react-bootstrap';
import vocabularyService from '../services/vocabularyService';
import { LearnedWord } from '../types';
import { useAuth } from '../contexts/AuthContext';
  
/**
 * format date
 */
const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  } catch (error) {
    return '';
  }
};

/**
 * LearnedWords page component
 * Displays all words that the user has saved
 */
const LearnedWordsPage: React.FC = () => {
  const [words, setWords] = useState<LearnedWord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  /**
   * Fetch all learned words for the current user
   * Always fetch fresh data from the API, bypassing cache
   */
  const fetchLearnedWords = async () => {
    if (!isAuthenticated) {
      return; // do not call API if not authenticated
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // add timestamp to the request to bypass cache
      const timestamp = new Date().getTime();
      const cacheBuster = `?t=${timestamp}`;
      const learnedWords = await vocabularyService.getLearnedWords(cacheBuster);
      setWords(learnedWords);
    } catch (err) {
      setError('Không thể tải danh sách các từ đã học. Vui lòng thử lại sau.');
      console.error('Error fetching learned words:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Remove a word from the learned words list
   */
  const removeWord = async (id: number) => {
    setIsLoading(true);
    
    try {
      const result = await vocabularyService.removeLearnedWord(id);
      if (result.success) {
        // update the state by removing the word
        setWords(words.filter(word => word.id !== id));
      } else {
        setError(result.error || 'Không thể xóa từ này. Vui lòng thử lại sau.');
      }
    } catch (err) {
      setError('Không thể xóa từ này. Vui lòng thử lại sau.');
      console.error('Error removing word:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // load learned words when component mounts or authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchLearnedWords();
    }
  }, [isAuthenticated]);

  // Thêm effect để tải lại dữ liệu mỗi khi component được hiển thị
  useEffect(() => {
    // Thêm event listener cho visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated) {
        fetchLearnedWords();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated]);

  // retry loading if there was an error
  const handleRetry = () => {
    fetchLearnedWords();
  };

  return (
    <Container className="py-4">
      <div className="page-header">
        <h1 className="page-title">Từ vựng đã học</h1>
        <p className="page-description">
          Danh sách các từ vựng bạn đã lưu
        </p>
        <Button 
          variant="outline-primary" 
          onClick={fetchLearnedWords} 
          disabled={isLoading}
          className="mb-3"
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Làm mới danh sách
        </Button>
      </div>
      
      {error && (
        <Alert variant="danger" className="d-flex justify-content-between align-items-center">
          <div>{error}</div>
          <Button variant="outline-danger" size="sm" onClick={handleRetry}>
            Thử lại
          </Button>
        </Alert>
      )}
      
      <Card className="word-card">
        <Card.Body>
          {isLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Đang tải...</span>
              </Spinner>
            </div>
          ) : words.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted mb-4">Bạn chưa lưu từ vựng nào.</p>
              <Button variant="primary" href="/wordgenerator">
                <i className="bi bi-plus-circle me-2"></i>
                Bắt đầu học từ mới
              </Button>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>Từ vựng</th>
                    <th className="text-end">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {words.map((word, index) => (
                    <tr key={word.id || index}>
                      <td>{index + 1}</td>
                      <td>{word.word}</td>
                      <td className="text-end">
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => removeWord(word.id)}
                          disabled={isLoading}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LearnedWordsPage; 