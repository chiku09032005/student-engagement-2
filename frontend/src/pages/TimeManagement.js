import React, { useState, useEffect, useRef } from 'react';
import { timeManagementAPI } from '../services/api';
import '../styles/App.css';

const TimeManagement = () => {
  const [workouts, setWorkouts] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [tab, setTab] = useState('workouts');
  const [formData, setFormData] = useState({
    exercises: [{ name: '', duration: 0, reps: 0, calories: 0 }],
    totalDuration: 0,
    totalCalories: 0,
    mood: 'good',
    startTime: '',
    alarm: false,
    notes: '',
  });
  const [scheduleForm, setScheduleForm] = useState({
    slots: [{ time: '', activity: '', duration: 0, priority: 'medium', alarm: false }],
  });
  const [loading, setLoading] = useState(true);
  const alarmTimeouts = useRef([]);

  useEffect(() => {
    requestNotificationPermission();
    fetchData();
    return clearAlarms;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearAlarms = () => {
    alarmTimeouts.current.forEach(clearInterval);
    alarmTimeouts.current = [];
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const parseTimeToDate = (timeString, baseDate = new Date()) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date(baseDate);
    date.setHours(hours || 0, minutes || 0, 0, 0);
    return date;
  };

  const notifyUser = (title, message, repeatInterval = 5 * 60 * 1000) => { // 5 minutes default
    const showNotification = () => {
      if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(title, {
          body: message,
          requireInteraction: true,
          tag: title + message // prevents duplicate notifications
        });

        notification.onclick = () => {
          notification.close();
          clearInterval(repeatIntervalId);
        };
      } else {
        const confirmed = window.confirm(`${title}\n${message}\n\nClick OK to stop this reminder.`);
        if (confirmed) {
          clearInterval(repeatIntervalId);
        }
      }
    };

    showNotification();
    const repeatIntervalId = setInterval(showNotification, repeatInterval);
    return repeatIntervalId;
  };

  const scheduleAlarms = (workoutsList, schedulesList) => {
    clearAlarms();
    const now = new Date();

    workoutsList.forEach((workout) => {
      if (workout.alarm && workout.startTime) {
        const alarmDate = parseTimeToDate(workout.startTime, new Date(workout.date));
        const delay = alarmDate.getTime() - now.getTime();
        if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
          const timeoutId = setTimeout(() => {
            const intervalId = notifyUser(
              'Workout Reminder',
              `Time to workout: ${workout.exercises[0]?.name || 'Exercise'} at ${workout.startTime}`
            );
            alarmTimeouts.current.push(intervalId);
          }, delay);
          alarmTimeouts.current.push(timeoutId);
        }
      }
    });

    schedulesList.forEach((schedule) => {
      schedule.slots.forEach((slot) => {
        if (slot.alarm && slot.time) {
          const alarmDate = parseTimeToDate(slot.time, new Date(schedule.date));
          const delay = alarmDate.getTime() - now.getTime();
          if (delay > 0 && delay < 24 * 60 * 60 * 1000) {
            const timeoutId = setTimeout(() => {
              const intervalId = notifyUser('Schedule Reminder', `Upcoming: ${slot.activity} at ${slot.time}`);
              alarmTimeouts.current.push(intervalId);
            }, delay);
            alarmTimeouts.current.push(timeoutId);
          }
        }
      });
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [workoutRes, scheduleRes] = await Promise.all([
        timeManagementAPI.getWorkouts(),
        timeManagementAPI.getSchedules(),
      ]);
      setWorkouts(workoutRes.data.workouts);
      setSchedules(scheduleRes.data.schedules);
      scheduleAlarms(workoutRes.data.workouts, scheduleRes.data.schedules);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkoutSubmit = async (e) => {
    e.preventDefault();
    try {
      await timeManagementAPI.createWorkout(formData);
      setFormData({
        exercises: [{ name: '', duration: 0, reps: 0, calories: 0 }],
        totalDuration: 0,
        totalCalories: 0,
        mood: 'good',
      });
      fetchData();
      alert('Workout logged successfully!');
    } catch (error) {
      console.error('Error logging workout:', error);
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      await timeManagementAPI.createSchedule({
        date: new Date(),
        ...scheduleForm,
      });
      setScheduleForm({ slots: [{ time: '', activity: '', duration: 0, priority: 'medium' }] });
      fetchData();
      alert('Schedule created successfully!');
    } catch (error) {
      console.error('Error creating schedule:', error);
    }
  };

  return (
    <div className="container">
      <h1>⏰ Time Management & Wellness</h1>

      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => setTab('workouts')}
          className={`btn ${tab === 'workouts' ? 'btn-primary' : 'btn-danger'}`}
          style={{ marginRight: '1rem' }}
        >
          My Workouts
        </button>
        <button
          onClick={() => setTab('schedules')}
          className={`btn ${tab === 'schedules' ? 'btn-primary' : 'btn-danger'}`}
          style={{ marginRight: '1rem' }}
        >
          Daily Schedule
        </button>
        <button
          onClick={clearAlarms}
          className="btn btn-warning"
          title="Stop all active alarms"
        >
          Stop All Alarms
        </button>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <>
          {tab === 'workouts' ? (
            <>
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="card">
                  <h2>Log Workout</h2>
                  <form onSubmit={handleWorkoutSubmit}>
                    <div className="form-group">
                      <label>Exercise Name</label>
                      <input
                        type="text"
                        value={formData.exercises[0]?.name || ''}
                        onChange={(e) => {
                          const newExercises = [...formData.exercises];
                          newExercises[0].name = e.target.value;
                          setFormData({ ...formData, exercises: newExercises });
                        }}
                        placeholder="e.g., Running, Push-ups"
                      />
                    </div>

                    <div className="form-group">
                      <label>Duration (minutes)</label>
                      <input
                        type="number"
                        value={formData.exercises[0]?.duration || 0}
                        onChange={(e) => {
                          const newExercises = [...formData.exercises];
                          newExercises[0].duration = parseInt(e.target.value) || 0;
                          setFormData({ ...formData, exercises: newExercises, totalDuration: parseInt(e.target.value) || 0 });
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label>Start Time</label>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={formData.alarm}
                          onChange={(e) => setFormData({ ...formData, alarm: e.target.checked })}
                        />{' '}
                        Enable Workout Alarm
                      </label>
                    </div>

                    <div className="form-group">
                      <label>Calories Burned</label>
                      <input
                        type="number"
                        value={formData.exercises[0]?.calories || 0}
                        onChange={(e) => {
                          const newExercises = [...formData.exercises];
                          newExercises[0].calories = parseInt(e.target.value) || 0;
                          setFormData({ ...formData, exercises: newExercises, totalCalories: parseInt(e.target.value) || 0 });
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label>Mood After Workout</label>
                      <select
                        value={formData.mood}
                        onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                      >
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="average">Average</option>
                        <option value="poor">Poor</option>
                      </select>
                    </div>

                    <button type="submit" className="btn btn-success">
                      Log Workout
                    </button>
                  </form>
                </div>

                <div className="card">
                  <h2>Recent Workouts</h2>
                  {workouts.length === 0 ? (
                    <p>No workouts logged yet. Start your fitness journey!</p>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <th>Exercise</th>
                          <th>Duration</th>
                          <th>Calories</th>
                          <th>Alarm</th>
                          <th>Mood</th>
                        </tr>
                      </thead>
                      <tbody>
                        {workouts.slice(0, 5).map((workout) => (
                          <tr key={workout._id}>
                            <td>{workout.exercises[0]?.name}</td>
                            <td>{workout.totalDuration} min</td>
                            <td>{workout.totalCalories} kcal</td>
                            <td>{workout.alarm ? 'On' : 'Off'}</td>
                            <td>{workout.mood}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="card">
                  <h2>Create Daily Schedule</h2>
                  <form onSubmit={handleScheduleSubmit}>
                    <div className="form-group">
                      <label>Time</label>
                      <input
                        type="time"
                        value={scheduleForm.slots[0]?.time || ''}
                        onChange={(e) => {
                          const newSlots = [...scheduleForm.slots];
                          newSlots[0].time = e.target.value;
                          setScheduleForm({ ...scheduleForm, slots: newSlots });
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={scheduleForm.slots[0]?.alarm || false}
                          onChange={(e) => {
                            const newSlots = [...scheduleForm.slots];
                            newSlots[0].alarm = e.target.checked;
                            setScheduleForm({ ...scheduleForm, slots: newSlots });
                          }}
                        />{' '}
                        Enable Schedule Alarm
                      </label>
                    </div>

                    <div className="form-group">
                      <label>Activity</label>
                      <input
                        type="text"
                        value={scheduleForm.slots[0]?.activity || ''}
                        onChange={(e) => {
                          const newSlots = [...scheduleForm.slots];
                          newSlots[0].activity = e.target.value;
                          setScheduleForm({ ...scheduleForm, slots: newSlots });
                        }}
                        placeholder="e.g., Math Study, Exercise"
                      />
                    </div>

                    <div className="form-group">
                      <label>Duration (minutes)</label>
                      <input
                        type="number"
                        value={scheduleForm.slots[0]?.duration || 0}
                        onChange={(e) => {
                          const newSlots = [...scheduleForm.slots];
                          newSlots[0].duration = parseInt(e.target.value);
                          setScheduleForm({ ...scheduleForm, slots: newSlots });
                        }}
                      />
                    </div>

                    <div className="form-group">
                      <label>Priority</label>
                      <select
                        value={scheduleForm.slots[0]?.priority || 'medium'}
                        onChange={(e) => {
                          const newSlots = [...scheduleForm.slots];
                          newSlots[0].priority = e.target.value;
                          setScheduleForm({ ...scheduleForm, slots: newSlots });
                        }}
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>

                    <button type="submit" className="btn btn-success">
                      Create Schedule
                    </button>
                  </form>
                </div>

                <div className="card">
                  <h2>Your Schedules</h2>
                  {schedules.length === 0 ? (
                    <p>No schedules created yet. Plan your day!</p>
                  ) : (
                    <div>
                      {schedules.slice(0, 5).map((schedule) => (
                        <div key={schedule._id} style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f7f7f7', borderRadius: '4px' }}>
                          {schedule.slots.map((slot, idx) => (
                            <div key={idx} style={{ marginBottom: '0.75rem' }}>
                              <strong>{slot.time} - {slot.activity}</strong>
                              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                                Duration: {slot.duration} min | Priority: {slot.priority} | Alarm: {slot.alarm ? 'On' : 'Off'}
                              </p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default TimeManagement;
