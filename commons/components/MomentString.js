export function setMomentFutureString(moment, locale = 'id') {
    if (locale == 'id')
        moment.updateLocale('id', {
            relativeTime: {
                future: "%s lagi",
                past: "sudah selesai",
                s: 'sedang berjalan',
                ss: 'sedang berjalan',
                m: "sedang berjalan",
                mm: "sedang berjalan",
                h: "sejam",
                hh: "%d jam",
                d: "sehari",
                dd: (number, withoutSuffix, key, isFuture) => {
                    if (number < 7)
                        return `${number} hari`;
                    else {
                        let week = Math.round(number / 7);
                        if (week == 1)
                            return `seminggu`;
                        else
                            return `${week} minggu`;
                    }
                },
                M: "sebulan",
                MM: "%d bulan",
                y: "setahun",
                yy: "%d tahun"
            }
        });
}