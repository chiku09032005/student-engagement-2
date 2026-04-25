import React, { useState, useEffect } from 'react';
import { gameAPI } from '../services/api';
import '../styles/App.css';

const Games = () => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [userScores, setUserScores] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScores, setShowScores] = useState(false);
  const [memoryCards, setMemoryCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [gameScore, setGameScore] = useState(0);

  useEffect(() => {
    fetchGames();
    fetchUserScores();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await gameAPI.getAllGames();
      setGames(response.data.games);
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserScores = async () => {
    try {
      const response = await gameAPI.getUserScores();
      setUserScores(response.data.scores);
    } catch (error) {
      console.error('Error fetching scores:', error);
    }
  };

  const fetchLeaderboard = async (gameId) => {
    try {
      const response = await gameAPI.getLeaderboard(gameId, 10);
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  // Memory Game Functions
  const initializeMemoryGame = () => {
    const symbols = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎪', '🎺'];
    const cards = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }));
    setMemoryCards(cards);
    setFlippedCards([]);
    setMatchedCards([]);
    setGameStartTime(Date.now());
  };

  const flipCard = (cardId) => {
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(cardId)) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setMemoryCards(prev => prev.map(card =>
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));

    if (newFlippedCards.length === 2) {
      setTimeout(() => checkMatch(newFlippedCards), 1000);
    }
  };

  const checkMatch = (flippedCardIds) => {
    const [firstId, secondId] = flippedCardIds;
    const firstCard = memoryCards.find(card => card.id === firstId);
    const secondCard = memoryCards.find(card => card.id === secondId);

    if (firstCard.symbol === secondCard.symbol) {
      setMatchedCards(prev => [...prev, firstId, secondId]);
      setMemoryCards(prev => prev.map(card =>
        flippedCardIds.includes(card.id) ? { ...card, isMatched: true } : card
      ));
    } else {
      setMemoryCards(prev => prev.map(card =>
        flippedCardIds.includes(card.id) ? { ...card, isFlipped: false } : card
      ));
    }
    setFlippedCards([]);
  };

  // Quiz Game Functions
  const startQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswers([]);
    setGameScore(0);
    setGameStartTime(Date.now());
  };

  const answerQuestion = (answerIndex) => {
    const question = selectedGame.questions[currentQuestion];
    const isCorrect = answerIndex === question.correctAnswer;
    const newScore = isCorrect ? gameScore + question.points : gameScore;

    setUserAnswers(prev => [...prev, answerIndex]);
    setGameScore(newScore);

    if (currentQuestion < selectedGame.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Game finished
      submitScore(newScore);
    }
  };

  const submitScore = async (finalScore) => {
    const timeTaken = Math.floor((Date.now() - gameStartTime) / 1000);

    try {
      await gameAPI.submitScore({
        gameId: selectedGame._id,
        score: finalScore,
        correctAnswers: userAnswers.filter((answer, index) =>
          answer === selectedGame.questions[index].correctAnswer
        ).length,
        totalQuestions: selectedGame.questions.length,
        timeTaken,
      });
      alert(`Game completed! Score: ${finalScore}/${selectedGame.totalPoints}`);
      fetchUserScores();
      fetchLeaderboard(selectedGame._id);
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };

  const playGame = async (game) => {
    let gameDetails = game;

    if (!game.questions || game.questions.length === 0) {
      try {
        const response = await gameAPI.getGameById(game._id);
        gameDetails = response.data.game;
      } catch (error) {
        console.error('Error loading game details:', error);
        alert('Could not load game details. Please try again later.');
        return;
      }
    }

    setSelectedGame(gameDetails);
    fetchLeaderboard(game._id);

    if (gameDetails.type === 'memory') {
      initializeMemoryGame();
    } else if (gameDetails.questions && gameDetails.questions.length > 0) {
      startQuiz();
    }
  };

  return (
    <div className="container">
      <h1>🎮 Games & Challenges</h1>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="grid">
          {!selectedGame ? (
            <>
              {games.map((game) => (
                <div key={game._id} className="card">
                  <h3>{game.name}</h3>
                  <p>{game.description}</p>
                  <p>
                    <span className="badge badge-primary">{game.type}</span>
                    <span className="badge badge-warning" style={{ marginLeft: '0.5rem' }}>
                      {game.difficulty}
                    </span>
                  </p>
                  <p>Points: {game.totalPoints}</p>
                  <button onClick={() => playGame(game)} className="btn btn-primary">
                    Play Now
                  </button>
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="card" style={{ gridColumn: '1 / -1' }}>
                <h2>{selectedGame.name}</h2>
                <p>{selectedGame.description}</p>

                {/* Memory Game */}
                {selectedGame.type === 'memory' && (
                  <div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '1rem',
                      maxWidth: '400px',
                      margin: '0 auto'
                    }}>
                      {memoryCards.map((card) => (
                        <div
                          key={card.id}
                          onClick={() => !card.isFlipped && !card.isMatched && flipCard(card.id)}
                          style={{
                            width: '80px',
                            height: '80px',
                            backgroundColor: card.isFlipped || card.isMatched ? '#fff' : '#667eea',
                            border: '2px solid #ddd',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            cursor: card.isFlipped || card.isMatched ? 'default' : 'pointer',
                            transition: 'all 0.3s',
                          }}
                        >
                          {card.isFlipped || card.isMatched ? card.symbol : '?'}
                        </div>
                      ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                      <p>Matched pairs: {matchedCards.length / 2} / 8</p>
                      {matchedCards.length === 16 && (
                        <div>
                          <h3>🎉 Congratulations! You won!</h3>
                          <p>Time: {Math.floor((Date.now() - gameStartTime) / 1000)} seconds</p>
                          <button onClick={() => submitScore(100)} className="btn btn-success">
                            Submit Score
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Quiz Games */}
                {selectedGame.questions && selectedGame.questions.length > 0 && (
                  <div>
                    {currentQuestion < selectedGame.questions.length ? (
                      <div>
                        <h3>Question {currentQuestion + 1} of {selectedGame.questions.length}</h3>
                        <p style={{ fontSize: '1.2rem', margin: '1rem 0' }}>
                          {selectedGame.questions[currentQuestion].question}
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          {selectedGame.questions[currentQuestion].options.map((option, index) => (
                            <button
                              key={index}
                              onClick={() => answerQuestion(index)}
                              className="btn btn-primary"
                              style={{ padding: '1rem', fontSize: '1rem' }}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                        <div style={{ marginTop: '2rem' }}>
                          <p>Current Score: {gameScore} / {selectedGame.totalPoints}</p>
                        </div>
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center' }}>
                        <h3>Quiz Completed!</h3>
                        <p>Final Score: {gameScore} / {selectedGame.totalPoints}</p>
                        <p>Correct Answers: {userAnswers.filter((answer, index) =>
                          answer === selectedGame.questions[index].correctAnswer
                        ).length} / {selectedGame.questions.length}</p>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => setSelectedGame(null)}
                  className="btn btn-danger"
                  style={{ marginTop: '1rem' }}
                >
                  Back to Games
                </button>
              </div>

              {/* Leaderboard */}
              <div className="card" style={{ gridColumn: '1 / -1' }}>
                <h3>🏆 Leaderboard</h3>
                {leaderboard.length > 0 ? (
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {leaderboard.map((entry, index) => (
                      <div key={entry._id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.5rem',
                        borderBottom: '1px solid #eee',
                        backgroundColor: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : 'transparent'
                      }}>
                        <span>#{index + 1} {entry.userId?.name || 'Anonymous'}</span>
                        <span>{entry.score} pts</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No scores yet. Be the first to play!</p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Your Scores */}
      {!selectedGame && userScores.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>Your Recent Scores</h2>
          <table>
            <thead>
              <tr>
                <th>Game</th>
                <th>Score</th>
                <th>Correct Answers</th>
                <th>Time Taken</th>
              </tr>
            </thead>
            <tbody>
              {userScores.slice(0, 10).map((score) => (
                <tr key={score._id}>
                  <td>{score.gameId?.name}</td>
                  <td>{score.score}</td>
                  <td>{score.correctAnswers}/{score.totalQuestions}</td>
                  <td>{Math.floor(score.timeTaken / 60)}m {score.timeTaken % 60}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Games;
