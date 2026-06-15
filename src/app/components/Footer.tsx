import BrandLogo from './BrandLogo'
import PaymentButton from './PaymentButton'
import { SITE_CONTACT_LINKS, SITE_EMAIL, SITE_NAME, SITE_NAV, SITE_PHONE, SITE_PHONE_DISPLAY } from '../site'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <nav className={styles.links} aria-label="Навігація в підвалі">
          {SITE_NAV.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>

        <div className={styles.cols}>
          <div className={styles.col}>
            <h3>Формат</h3>
            <p>10 тем за 10 занять</p>
            <p>70 днів підтримки від куратора</p>
            <PaymentButton className={styles.inlineLink} aria-label="Оформити доступ">
              Оформити доступ →
            </PaymentButton>
          </div>

          <div className={styles.col}>
            <h3>Контакт</h3>
            <p>Онлайн-формат</p>
            <a href={`tel:${SITE_PHONE}`} className={styles.inlineLink}>{SITE_PHONE_DISPLAY}</a>
            <a href={`mailto:${SITE_EMAIL}`} className={styles.inlineLink}>{SITE_EMAIL}</a>
          </div>

          <div className={styles.col}>
            <h3>Зв&apos;язок</h3>
            {SITE_CONTACT_LINKS.filter((link) => link.external).map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={styles.inlineLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.wordmark}>
        <BrandLogo href="/" size="lg" variant="dark" />
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} {SITE_NAME}. Усі права захищені.</span>
        <a href={`mailto:${SITE_EMAIL}?subject=Політика%20конфіденційності`} className={styles.inlineLink}>
          Політика конфіденційності
        </a>
      </div>
    </footer>
  )
}
