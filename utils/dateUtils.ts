
import type { TimePeriod } from '../types';

/**
 * Parses a 'YYYY-MM-DD' string into a Date object in the local timezone.
 * This avoids timezone issues where new Date('YYYY-MM-DD') might be interpreted as UTC midnight,
 * which can be the previous day in some timezones.
 * @param isoDate - The date string in 'YYYY-MM-DD' format.
 * @returns A Date object representing the start of the day in the local timezone.
 */
const getLocalDate = (isoDate: string): Date => {
    const [year, month, day] = isoDate.split('-').map(Number);
    // new Date(year, monthIndex, day) creates a date in the local timezone
    return new Date(year, month - 1, day);
};

export const isWithinPeriod = (isoDate: string, period: TimePeriod): boolean => {
    if (period === 'all') {
        return true;
    }

    const transactionDate = getLocalDate(isoDate);
    const now = new Date();
    
    switch (period) {
        case 'day': {
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            return transactionDate.getTime() === today.getTime();
        }
        case 'week': {
            // Assuming Sunday is the start of the week (day 0)
            const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()); 
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            
            return transactionDate >= startOfWeek && transactionDate <= endOfWeek;
        }
        case 'month': {
            return (
                transactionDate.getFullYear() === now.getFullYear() &&
                transactionDate.getMonth() === now.getMonth()
            );
        }
        default:
            return true;
    }
};
