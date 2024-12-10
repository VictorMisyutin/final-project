import React, { useState, useEffect } from 'react';
import './AddMatch.css';
import config from '../../config';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  sport: string[];
}

interface Tournament {
  _id: string;
  title: string;
  sport: string;
}

const AddMatch: React.FC = () => {
  const [players, setPlayers] = useState<User[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [winnerId, setWinnerId] = useState<string>(''); // New Winner field
  const [loserId, setLoserId] = useState<string>(''); // Loser field
  const [tournamentId, setTournamentId] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(config.backendUrl + '/api/users');
        const data = await response.json();
        setPlayers(data.data);
      } catch (error) {
        console.error('Error fetching players:', error);
      }
    };

    const fetchTournaments = async () => {
      try {
        const response = await fetch(config.backendUrl + '/api/tournaments');
        const data = await response.json();
        setTournaments(data.data);
      } catch (error) {
        console.error('Error fetching tournaments:', error);
      }
    };

    fetchUsers();
    fetchTournaments();
  }, []);

  const handleAddMatch = async () => {
    if (!winnerId || !loserId || !tournamentId || !startDate) {
      setMessage('Please fill in all fields');
      return;
    }
  
    if (winnerId === loserId) {
      setMessage('Winner and Loser cannot be the same player');
      return;
    }
  
    const matchData = {
      playerOneId: winnerId, // Winner
      playerTwoId: loserId,  // Loser
      tournamentId,
      startDate: new Date(startDate).toISOString(),
      winnerId: winnerId, // Explicit Winner field
    };
  
    console.log('Match Data:', matchData); // Debugging
  
    setLoading(true);
    try {
      const response = await fetch(config.backendUrl + '/api/matches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(matchData),
      });
  
      const data = await response.json();
  
      if (data.message === 'Match created') {
        setMessage('Match added successfully');
        setWinnerId('');
        setLoserId('');
        setTournamentId('');
        setStartDate('');
      } else {
        setMessage(data.message || 'Error creating match');
      }
    } catch (error) {
      setMessage('Error creating match');
      console.error('Error adding match:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-match-container">
      <h2>Submit Match Result</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        {/* Winner Selection */}
        <div className="form-group">
          <label>Winner</label>
          <select
            value={winnerId}
            onChange={(e) => setWinnerId(e.target.value)}
            required
          >
            <option value="">Select Winner</option>
            {players.map((player) => (
              <option key={player._id} value={player._id}>
                {player.firstName} {player.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* Loser Selection */}
        <div className="form-group">
          <label>Loser</label>
          <select
            value={loserId}
            onChange={(e) => setLoserId(e.target.value)}
            required
          >
            <option value="">Select Loser</option>
            {players.map((player) => (
              <option key={player._id} value={player._id}>
                {player.firstName} {player.lastName}
              </option>
            ))}
          </select>
        </div>

        {/* Tournament Selection */}
        <div className="form-group">
          <label>Tournament</label>
          <select
            value={tournamentId}
            onChange={(e) => setTournamentId(e.target.value)}
            required
          >
            <option value="">Select Tournament</option>
            {tournaments.map((tournament) => (
              <option key={tournament._id} value={tournament._id}>
                {tournament.title}
              </option>
            ))}
          </select>
        </div>

        {/* Match Start Date */}
        <div className="form-group">
          <label>Match Date & Time</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleAddMatch}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Add Match'}
        </button>
      </form>

      {/* Message Display */}
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AddMatch;
