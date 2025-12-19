import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PunchTimings from './PunchTimings';
import * as api from '../utils/api';

// Mock the API functions
jest.mock('../utils/api', () => ({
  getTimings: jest.fn(),
  punchIn: jest.fn(),
  punchOut: jest.fn(),
  breakStart: jest.fn(),
  breakEnd: jest.fn(),
}));

const mockGetTimings = api.getTimings;
const mockPunchIn = api.punchIn;
const mockPunchOut = api.punchOut;
const mockBreakStart = api.breakStart;
const mockBreakEnd = api.breakEnd;

describe('PunchTimings', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test('optimistically updates UI on successful punch-in', async () => {
    // Arrange: Initial state is 'Not punched in'
    mockGetTimings.mockResolvedValue({
      punchIn: null,
      punchOut: null,
      breakStart: null,
      breakEnd: null,
      totalHours: null,
    });
    
    // Mock a successful punch-in API response
    const punchInTime = '09:00 AM';
    mockPunchIn.mockResolvedValue({ status: 'punched in', time: punchInTime });

    render(<PunchTimings />);

    // Wait for initial timings to be fetched and displayed
    await waitFor(() => {
      expect(screen.getByText(/Not punched in/i)).toBeInTheDocument();
    });

    // Act: Click the 'Punch In' button
    fireEvent.click(screen.getByRole('button', { name: /Punch In/i }));

    // Assert: The UI should immediately update to show the punch-in time
    await waitFor(() => {
      expect(screen.getByText(`Punch In: ${punchInTime}`)).toBeInTheDocument();
    });
    
    // Assert: getTimings should NOT have been called again after the punch-in
    expect(mockGetTimings).toHaveBeenCalledTimes(1);
  });
    test('optimistically updates UI on successful punch-out', async () => {
    // Arrange: Initial state is 'punched in'
    const punchInTime = '09:00 AM';
    mockGetTimings.mockResolvedValue({
      punchIn: punchInTime,
      punchOut: null,
      breakStart: null,
      breakEnd: null,
      totalHours: '0h',
    });
    
    // Mock a successful punch-out API response
    const punchOutTime = '05:00 PM';
    mockPunchOut.mockResolvedValue({ status: 'punched out', time: punchOutTime });

    render(<PunchTimings />);

    // Wait for initial timings to be fetched
    await waitFor(() => {
      expect(screen.getByText(`Punch In: ${punchInTime}`)).toBeInTheDocument();
    });

    // Act: Click the 'Punch Out' button
    fireEvent.click(screen.getByRole('button', { name: /Punch Out/i }));

    // Assert: The UI should immediately update to show the punch-out time
    await waitFor(() => {
      expect(screen.getByText(`Punch Out: ${punchOutTime}`)).toBeInTheDocument();
    });
    
    // Assert: getTimings should NOT have been called again after punch-out
    expect(mockGetTimings).toHaveBeenCalledTimes(1);
  });
  test('optimistically updates UI on successful break start', async () => {
    // Arrange: User is punched in
    const punchInTime = '09:00 AM';
    mockGetTimings.mockResolvedValue({
      punchIn: punchInTime,
      punchOut: null,
      breakStart: null,
      breakEnd: null,
      totalHours: '3h',
    });
    
    const breakStartTime = '12:00 PM';
    mockBreakStart.mockResolvedValue({ status: 'break started', time: breakStartTime });

    render(<PunchTimings />);

    await waitFor(() => {
      expect(screen.getByText(`Punch In: ${punchInTime}`)).toBeInTheDocument();
    });
    
    // Act: Click the 'Start Break' button
    fireEvent.click(screen.getByRole('button', { name: /Start Break/i }));

    // Assert: UI updates to show break start time
    await waitFor(() => {
      expect(screen.getByText(`Break Start: ${breakStartTime}`)).toBeInTheDocument();
    });
    
    // Assert: getTimings is not called again
    expect(mockGetTimings).toHaveBeenCalledTimes(1);
  });
  test('optimistically updates UI on successful break end', async () => {
    // Arrange: User is on a break
    const punchInTime = '09:00 AM';
    const breakStartTime = '12:00 PM';
    mockGetTimings.mockResolvedValue({
      punchIn: punchInTime,
      punchOut: null,
      breakStart: breakStartTime,
      breakEnd: null,
      totalHours: '3h',
    });
    
    const breakEndTime = '12:30 PM';
    mockBreakEnd.mockResolvedValue({ status: 'break ended', time: breakEndTime });

    render(<PunchTimings />);
    
    // Wait for the break start time to be displayed
    await waitFor(() => {
      expect(screen.getByText(`Break Start: ${breakStartTime}`)).toBeInTheDocument();
    });

    // Act: Click the 'End Break' button
    fireEvent.click(screen.getByRole('button', { name: /End Break/i }));

    // Assert: UI updates to show break end time
    await waitFor(() => {
      expect(screen.getByText(`Break End: ${breakEndTime}`)).toBeInTheDocument();
    });
    
    // Assert: getTimings is not called again
    expect(mockGetTimings).toHaveBeenCalledTimes(1);
  });
});
