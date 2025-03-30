<template>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Система автоматизированного анализа компетенций IT-специалистов</title>
  <link rel="stylesheet" href="style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
</head>
<body>

  <header>
    <nav>
      <div class="logo">
        <a href="#">SkillMatch AI</a>
      </div>
      <ul>
        <li><a href="#about">О системе</a></li>
        <li><a href="#features">Возможности</a></li>
        <li><a href="#pricing">Тарифы</a></li>
        <li><a href="#contact">Контакты</a></li>
      </ul>
    </nav>
  </header>

  <section id="hero">
    <div class="hero-content">
      <h1>Эффективный подбор IT-специалистов: Анализ компетенций, основанный на данных рынка.</h1>
      <p>Автоматизированная система оценки соответствия навыков IT-специалистов требованиям вакансий и актуальным тенденциям рынка.</p>
      <a href="#demo" class="button">Заказать демо</a>
    </div>
  </section>

  <section id="about">
    <h2>О системе</h2>
    <div class="about-content">
      <img src="images/system_diagram.png" alt="Схема работы системы">
      <p>SkillMatch AI - это инновационная система, предназначенная для автоматизации процесса анализа соответствия компетенций IT-специалистов требованиям рынка труда. Наша платформа использует передовые алгоритмы машинного обучения и обработки естественного языка для извлечения и анализа ключевых навыков и опыта кандидатов, а также для сопоставления их с актуальными требованиями вакансий и тенденциями в IT-индустрии.</p>
      <p>Система позволяет значительно сократить время и затраты на подбор персонала, повысить точность оценки кандидатов и выявлять специалистов, которые наилучшим образом соответствуют требованиям компании.</p>
    </div>
  </section>

  <section id="features">
    <h2>Возможности</h2>
    <div class="features-grid">
      <div class="feature">
        <i class="fas fa-search"></i>
        <h3>Точность</h3>
        <p>Анализ на основе актуальных данных рынка и передовых алгоритмов машинного обучения.</p>
      </div>
      <div class="feature">
        <i class="fas fa-bolt"></i>
        <h3>Скорость</h3>
<p>Автоматизированная оценка за считанные минуты, экономя ваше время.</p>
</div>
<div class="feature">
  <i class="fas fa-chart-line"></i>
  <h3>Экономия</h3>
  <p>Сокращение времени и затрат на подбор персонала, снижение стоимости ошибок при найме.</p>
</div>
<div class="feature">
  <i class="fas fa-user-check"></i>
  <h3>Объективность</h3>
  <p>Исключение субъективных факторов при оценке кандидатов.</p>
</div>
<div class="feature">
  <i class="fas fa-lightbulb"></i>
  <h3>Поиск скрытых талантов</h3>
  <p>Выявление кандидатов, соответствующих требованиям, даже если они не указаны явно.</p>
</div>
</div>
</section>

<section id="pricing">
<h2>Тарифы</h2>
<div class="pricing-grid">
<div class="pricing-plan">
  <h3>Basic</h3>
  <p class="price">Free</p>
  <ul>
    <li>5 анализов в месяц</li>
    <li>Базовый отчет</li>
    <li>Поддержка по email</li>
  </ul>
  <a href="#" class="button">Выбрать Basic</a>
</div>
<div class="pricing-plan">
  <h3>Standard</h3>
  <p class="price">$99/месяц</p>
  <ul>
    <li>50 анализов в месяц</li>
    <li>Расширенный отчет</li>
    <li>Приоритетная поддержка</li>
  </ul>
  <a href="#" class="button">Выбрать Standard</a>
</div>
<div class="pricing-plan">
  <h3>Premium</h3>
  <p class="price">$299/месяц</p>
  <ul>
    <li>Неограниченное количество анализов</li>
    <li>Полный отчет с рекомендациями</li>
    <li>Персональный менеджер</li>
  </ul>
  <a href="#" class="button">Выбрать Premium</a>
</div>
</div>
</section>

<section id="contact">
<h2>Контакты</h2>
<div class="contact-form">
<form>
  <input type="text" placeholder="Ваше имя" required>
  <input type="email" placeholder="Ваш email" required>
  <textarea placeholder="Ваше сообщение" rows="5" required></textarea>
  <button type="submit" class="button">Отправить</button>
</form>
</div>
</section>

<footer>
<p>&copy; 202 SkillMatch AI. Все права защищены.</p>
</footer>

<section id="demo">
<h2>Закажите Демо</h2>
<p>Оставьте свои контактные данные и мы свяжемся с Вами для проведения демонстрации.</p>
<div class="demo-form">
    <form>
        <input type="text" placeholder="Ваше имя" required>
        <input type="email" placeholder="Ваш email" required>
        <input type="text" placeholder="Название компании">
        <button type="submit" class="button">Заказать Демо</button>
    </form>
</div>
</section>


</body>
</html>
</template>
<style>
body {
  font-family: sans-serif;
  margin: 0;
  padding: 0;
  line-height: 1.6;
  color: #333;
}

h1, h2, h3 {
  margin-bottom: 1rem;
}

a {
  text-decoration: none;
  color: #007bff;
}

/* Стили для шапки сайта */
header {
  background-color: #f8f9fa;
  padding: 1rem 0;
  border-bottom: 1px solid #dee2e6;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.logo a {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
}

nav ul li {
  margin-left: 1rem;
}

nav ul li a {
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

nav ul li a:hover {
  background-color: #007bff;
  color: #fff;
}

/* Стили для секции Hero */
#hero {
  background: linear-gradient(to right, #f0f8ff, #e6f7ff);
  padding: 5rem 0;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 2rem;
}

.button {
  display: inline-block;
  background-color: #007bff;
  color: #fff;
  padding: 1rem 2rem;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s ease;
  margin-top: 1rem;
}

.button:hover {
  background-color: #0056b3;
}

/* Стили для секции About */
#about {
  padding: 4rem 0;
  text-align: center;
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.about-content img {
  max-width: 500px;
  margin-bottom: 2rem;
}

/* Стили для секции Features */
#features {
  background-color: #f8f9fa;
  padding: 4rem 0;
  text-align: center;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.feature {
  padding: 2rem;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.feature i {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #007bff;
}

/* Стили для секции Pricing */
#pricing {
  padding: 4rem 0;
  text-align: center;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.pricing-plan {
  padding: 2rem;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.pricing-plan h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.pricing-plan .price {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.pricing-plan ul {
  list-style: none;
  padding: 0;
  margin-bottom: 1rem;
}

.pricing-plan ul li {
  margin-bottom: 0.5rem;
}

/* Стили для секции Contact */
#contact {
  background-color: #f8f9fa;
  padding: 4rem 0;
  text-align: center;
}

.contact-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1rem;
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ced4da;
  border-radius: 5px;
}

/* Стили для footer */
footer {
  background-color: #343a40;
  color: #fff;
  text-align: center;
  padding: 1rem 0;
}

/* Стили для секции Demo (Добавленная секция) */
#demo {
    padding: 4rem 0;
    text-align: center;
}

.demo-form {
    max-width: 600px;
    margin: 0 auto;
    padding: 0 1rem;
}

.demo-form input {
    width: 100%;
    padding: 1rem;
    margin-bottom: 1rem;
    border: 1px solid #ced4da;
    border-radius: 5px;
}

/* Адаптивные стили */
@media (max-width: 768px) {
  nav {
    flex-direction: column;
    align-items: flex-start;
  }

  nav ul {
    margin-top: 1rem;
    flex-direction: column;
  }

  nav ul li {
    margin-left: 0;
    margin-bottom: 0.5rem;
  }

  .hero-content h1 {
    font-size: 2.5rem;
  }
}
</style>
