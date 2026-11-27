// Підключаємо бібліотеку Playwright для керування браузером
const { chromium } = require('playwright');

(async () => {
  // Запускаємо браузер Chromium у видимому режимі (headless: false) із затримкою slowMo
  const browser = await chromium.launch({ headless: false, slowMo: 800 });
  const page = await browser.newPage();

  console.log('Починаємо тестування сайту cnu.edu.ua...');

  // Переходимо на головну сторінку сайту університету
  await page.goto('https://cnu.edu.ua/', { waitUntil: 'domcontentloaded' });

  // ПЕРЕВІРКА 1: Відкриття вебсайту та перевірка його заголовка (Title)
  const pageTitle = await page.title();
  console.log(`Заголовок сторінки: "${pageTitle}"`);
  if (pageTitle && pageTitle.length > 0) {
    console.log('✅ Перевірка 1 пройдена: сайт успішно відкрито, заголовок відображається.');
  } else {
    throw new Error('❌ Перевірка 1 провалена: заголовок сторінки порожній.');
  }

  // ПЕРЕВІРКА 2: Перевірка наявності ключового елемента (меню навігації або логотипа)
  const navOrImgVisible = await page.locator('nav, img').first().isVisible();
  if (navOrImgVisible) {
    console.log('✅ Перевірка 2 пройдена: елементи навігації та логотип присутні на сторінці.');
  } else {
    throw new Error('❌ Перевірка 2 провалена: елементи інтерфейсу не знайдено.');
  }

  // ПЕРЕВІРКА 3: Перевірка взаємодії — клік на пункт меню «Підрозділи» та перехід на нову сторінку
  const menuLink = page.getByRole('link', { name: 'Підрозділи' }).first();
  console.log('Натискаємо на пункт меню "Підрозділи"...');

  await menuLink.click({ force: true });
  await page.waitForLoadState('domcontentloaded');

  const newUrl = page.url();
  console.log(`Поточна адреса після переходу: ${newUrl}`);
  if (newUrl !== 'https://cnu.edu.ua/') {
    console.log('✅ Перевірка 3 пройдена: успішно виконано перехід на сторінку підрозділів.');
  } else {
    throw new Error('❌ Перевірка 3 провалена: перехід на іншу сторінку не відбувся.');
  }

  console.log('🎉 Усі 3 автоматизовані перевірки успішно завершено!');

  // Закриваємо браузер
  await browser.close();
})();
