export interface Drone {
  id: string;
  name: string;
  price: number; // in UAH
  size: number; // in inches
  connection: 'fiber' | 'radio' | 'both';
  application: ('kamikaze' | 'bomber' | 'relay')[];
  specs: {
    range: string;
    flightTime: string;
    maxSpeed: string;
    payload: string;
    camera: string;
  };
  description: string;
  image?: string;
}

export const drones: Drone[] = [
{
  id: 'sokil-7',
  name: 'СОКІЛ-7',
  price: 12500,
  size: 7,
  connection: 'radio',
  application: ['kamikaze'],
  specs: {
    range: '10 км',
    flightTime: '15 хв',
    maxSpeed: '120 км/год',
    payload: '1.5 кг',
    camera: 'Analog 1200TVL'
  },
  description:
  'Легкий та маневрений FPV-дрон для точкових ударів на коротких дистанціях. Ідеальний для роботи в умовах міської забудови.'
},
{
  id: 'sokil-8',
  name: 'СОКІЛ-8 PRO',
  price: 14200,
  size: 8,
  connection: 'radio',
  application: ['kamikaze'],
  specs: {
    range: '12 км',
    flightTime: '18 хв',
    maxSpeed: '130 км/год',
    payload: '2.0 кг',
    camera: 'Analog Night Vision'
  },
  description:
  'Покращена версія з більшою вантажопідйомністю та дальністю польоту. Оснащений камерою нічного бачення.'
},
{
  id: 'grom-10',
  name: 'ГРІМ-10',
  price: 18500,
  size: 10,
  connection: 'radio',
  application: ['kamikaze', 'bomber'],
  specs: {
    range: '15 км',
    flightTime: '25 хв',
    maxSpeed: '110 км/год',
    payload: '3.5 кг',
    camera: 'Digital HD'
  },
  description:
  'Універсальний дрон середнього розміру. Може використовуватись як камікадзе або для скидання боєприпасів.'
},
{
  id: 'grom-10-fiber',
  name: 'ГРІМ-10 FIBER',
  price: 24000,
  size: 10,
  connection: 'fiber',
  application: ['kamikaze'],
  specs: {
    range: '10 км',
    flightTime: '20 хв',
    maxSpeed: '100 км/год',
    payload: '3.0 кг',
    camera: 'Digital HD'
  },
  description:
  'Спеціальна версія з керуванням через оптоволокно. Абсолютно нечутливий до засобів РЕБ.'
},
{
  id: 'yastrub-12',
  name: 'ЯСТРУБ-12',
  price: 28000,
  size: 12,
  connection: 'both',
  application: ['bomber', 'relay'],
  specs: {
    range: '20 км',
    flightTime: '35 хв',
    maxSpeed: '90 км/год',
    payload: '5.0 кг',
    camera: 'Thermal 640x512'
  },
  description:
  'Важкий дрон-бомбер з тепловізійною камерою. Може нести значне навантаження та працювати як ретранслятор.'
},
{
  id: 'yastrub-15',
  name: 'ЯСТРУБ-15 HEAVY',
  price: 45000,
  size: 15,
  connection: 'both',
  application: ['bomber'],
  specs: {
    range: '25 км',
    flightTime: '40 хв',
    maxSpeed: '85 км/год',
    payload: '8.0 кг',
    camera: 'Thermal + Zoom'
  },
  description:
  "Важкий бомбардувальник для знищення броньованої техніки та укріплень. Подвійна система зв'язку."
},
{
  id: 'berkut-7',
  name: 'БЕРКУТ-7',
  price: 13000,
  size: 7,
  connection: 'radio',
  application: ['kamikaze'],
  specs: {
    range: '11 км',
    flightTime: '16 хв',
    maxSpeed: '140 км/год',
    payload: '1.2 кг',
    camera: 'Analog High Res'
  },
  description:
  'Швидкісний дрон-перехоплювач для боротьби з ворожими БПЛА та швидкими цілями.'
},
{
  id: 'berkut-9',
  name: 'БЕРКУТ-9',
  price: 16500,
  size: 9,
  connection: 'radio',
  application: ['kamikaze'],
  specs: {
    range: '14 км',
    flightTime: '22 хв',
    maxSpeed: '125 км/год',
    payload: '2.5 кг',
    camera: 'Night Eagle'
  },
  description:
  'Оптимальний баланс між швидкістю та вантажопідйомністю. Відмінно працює в умовах низької освітленості.'
},
{
  id: 'shadow-20',
  name: 'ТІНЬ-20',
  price: 85000,
  size: 20,
  connection: 'both',
  application: ['bomber', 'relay'],
  specs: {
    range: '40 км',
    flightTime: '60 хв',
    maxSpeed: '80 км/год',
    payload: '12.0 кг',
    camera: 'Dual Thermal/Optical'
  },
  description:
  'Надпотужний дрон-бомбер дальнього радіусу дії. Може виконувати роль матки-ретранслятора для менших дронів.'
},
{
  id: 'shadow-13',
  name: 'ТІНЬ-13',
  price: 32000,
  size: 13,
  connection: 'radio',
  application: ['bomber'],
  specs: {
    range: '22 км',
    flightTime: '30 хв',
    maxSpeed: '95 км/год',
    payload: '6.0 кг',
    camera: 'Thermal'
  },
  description:
  'Ефективний нічний бомбардувальник. Тихий хід та низька помітність.'
},
{
  id: 'fiber-8',
  name: 'FIBER-8 STRIKE',
  price: 19500,
  size: 8,
  connection: 'fiber',
  application: ['kamikaze'],
  specs: {
    range: '8 км',
    flightTime: '15 хв',
    maxSpeed: '110 км/год',
    payload: '2.0 кг',
    camera: 'Digital 4K'
  },
  description:
  'Дрон на оптоволокні для роботи в зонах щільного РЕБ. Передає ідеально чітку картинку до моменту ураження.'
},
{
  id: 'relay-11',
  name: 'RELAY-11 SKY',
  price: 26000,
  size: 11,
  connection: 'radio',
  application: ['relay'],
  specs: {
    range: '30 км',
    flightTime: '45 хв',
    maxSpeed: '70 км/год',
    payload: '1.5 кг (обладнання)',
    camera: 'Navigation Cam'
  },
  description:
  'Спеціалізований дрон-ретранслятор для посилення сигналу та збільшення радіусу дії ударних груп.'
}];