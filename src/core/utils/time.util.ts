


export class TimeUtil {

    static getDate4monthsAgo(): Date {
        const date = new Date();
        date.setMonth(date.getMonth() - 4);
        return date;
    }
}