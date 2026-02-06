export type NewsItem = {
  time: string;
  title: string;
  url: string;
};

export type NewsGroup = {
  date: string;
  label: string;
  items: NewsItem[];
};

export const NEWS_FEED: NewsGroup[] = [
  {
    date: '2026-02-05',
    label: '5 лютого, сьогодні',
    items: [
      {
        time: '15:03',
        title: '30 тисяч знищених військових противника та рекорд зі збиття шахедів: результати Сил безпілотних систем у січні',
        url: 'https://mod.gov.ua/news/30-tisyach-znishhenih-vijskovih-protivnika-ta-rekord-zi-zbittya-shahediv-rezultati-sil-bezpilotnih-sistem-u-sichni'
      },
      {
        time: '10:24',
        title: 'Знищує техніку навіть за 30 кілометрів: нові дрони «Батон Оптик» поповнили арсенал Сил оборони',
        url: 'https://mod.gov.ua/news/znishhuye-tehniku-navit-za-30-kilometriv-novi-droni-baton-optik-popovnili-arsenal-sil-oboroni'
      },
      {
        time: '06:38',
        title: 'Бойові втрати ворога на 5 лютого 2026 року',
        url: 'https://mod.gov.ua/news/bojovi-vtrati-voroga-na-5-lyutogo-2026-roku'
      }
    ]
  },
  {
    date: '2026-02-04',
    label: '4 лютого, вчора',
    items: [
      {
        time: '10:56',
        title: 'Командири усіх рівнів: терміново верифікуйте всі термінали Starlink, що використовуються для оборони',
        url: 'https://mod.gov.ua/news/komandiri-usih-rivniv-terminovo-verifikujte-vsi-terminali-starlink-shho-vikoristovuyutsya-dlya-oboroni'
      },
      {
        time: '08:00',
        title: 'Бойові втрати ворога на 4 лютого 2026 року',
        url: 'https://mod.gov.ua/news/bojovi-vtrati-voroga-na-4-lyutogo-2026-roku'
      }
    ]
  },
  {
    date: '2026-02-03',
    label: '3 лютого, вівторок',
    items: [
      {
        time: '12:09',
        title: 'У січні російська авіація скинула найбільшу кількість КАБів за всі попередні місяці війни',
        url: 'https://mod.gov.ua/news/u-sichni-rosijska-aviacziya-skinula-najbilshu-kilkist-ka-biv-za-vsi-poperedni-misyaczi-vijni'
      },
      {
        time: '06:38',
        title: 'Бойові втрати ворога на 3 лютого 2026 року',
        url: 'https://mod.gov.ua/news/bojovi-vtrati-voroga-na-3-lyutogo-2026-roku'
      }
    ]
  },
  {
    date: '2026-02-02',
    label: '2 лютого, понеділок',
    items: [
      {
        time: '18:41',
        title: 'Боротьба з російськими дронами. Як пройти верифікацію Starlink, щоб термінал працював в Україні',
        url: 'https://mod.gov.ua/news/borotba-z-rosijskimi-dronami-yak-projti-verifikacziyu-starlink-shhob-terminal-praczyuvav-v-ukrayini'
      },
      {
        time: '16:43',
        title: 'Б’ємо ворога: мінус 137 танків, 1 099 артсистем і понад 4 000 одиниць автомобільної техніки - втрати рф у січні',
        url: 'https://mod.gov.ua/news/b-yemo-voroga-minus-137-tankiv-1-099-artsistem-i-ponad-4-000-odinicz-avtomobilnoyi-tehniki-vtrati-rf-u-sichni'
      },
      {
        time: '11:50',
        title: 'В Україні впроваджується верифікація терміналів Starlink для протидії російському повітряному терору',
        url: 'https://mod.gov.ua/news/v-ukrayini-vprovadzhuyetsya-verifikacziya-terminaliv-starlink-dlya-protidiyi-rosijskomu-povitryanomu-teroru'
      },
      {
        time: '06:38',
        title: 'Бойові втрати ворога на 2 лютого 2026 року',
        url: 'https://mod.gov.ua/news/bojovi-vtrati-voroga-na-2-lyutogo-2026-roku'
      }
    ]
  },
  {
    date: '2026-02-01',
    label: '1 лютого, неділя',
    items: [
      {
        time: '06:30',
        title: 'Бойові втрати ворога на 1 лютого 2026 року',
        url: 'https://mod.gov.ua/news/bojovi-vtrati-voroga-na-1-lyutogo-2026-roku'
      }
    ]
  },
  {
    date: '2026-01-31',
    label: '31 січня, субота',
    items: [
      {
        time: '07:32',
        title: 'Бойові втрати ворога на 31 січня 2026 року',
        url: 'https://mod.gov.ua/news/bojovi-vtrati-voroga-na-31-sichnya-2026-roku'
      }
    ]
  },
  {
    date: '2026-01-30',
    label: '30 січня, п’ятниця',
    items: [
      {
        time: '06:40',
        title: 'Бойові втрати ворога на 30 січня 2026 року',
        url: 'https://mod.gov.ua/news/bojovi-vtrati-voroga-na-30-sichnya-2026-roku'
      }
    ]
  },
  {
    date: '2026-01-29',
    label: '29 січня, четвер',
    items: [
      {
        time: '06:41',
        title: 'Бойові втрати ворога на 29 січня 2026 року',
        url: 'https://mod.gov.ua/news/bojovi-vtrati-voroga-na-29-sichnya-2026-roku'
      }
    ]
  },
  {
    date: '2026-01-28',
    label: '28 січня, середа',
    items: [
      {
        time: '20:52',
        title: 'Швидке зведення фортифікацій: Уряд усунув обмеження для ДССТ',
        url: 'https://mod.gov.ua/news/shvidke-zvedennya-fortifikaczij-uryad-usunuv-obmezhennya-dlya-dsst'
      },
      {
        time: '06:45',
        title: 'Бойові втрати ворога на 28 січня 2026 року',
        url: 'https://mod.gov.ua/news/bojovi-vtrati-voroga-na-28-sichnya-2026-roku'
      }
    ]
  },
  {
    date: '2026-01-27',
    label: '27 січня, вівторок',
    items: [
      {
        time: '06:43',
        title: 'Бойові втрати ворога на 27 січня 2026 року',
        url: 'https://mod.gov.ua/news/bojovi-vtrati-voroga-na-27-sichnya-2026-roku'
      }
    ]
  },
  {
    date: '2026-01-26',
    label: '26 січня, понеділок',
    items: [
      {
        time: '06:40',
        title: 'Бойові втрати ворога на 26 січня 2026 року',
        url: 'https://mod.gov.ua/news/bojovi-vtrati-voroga-na-26-sichnya-2026-roku'
      }
    ]
  },
  {
    date: '2026-01-25',
    label: '25 січня, неділя',
    items: [
      {
        time: '06:45',
        title: 'Бойові втрати ворога на 25 січня 2026 року',
        url: 'https://mod.gov.ua/news/bojovi-vtrati-voroga-na-25-sichnya-2026-roku'
      }
    ]
  }
];
