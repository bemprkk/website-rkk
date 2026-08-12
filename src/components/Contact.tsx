import { type FC, type ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, Mail, Instagram, ExternalLink, Send, User, Phone, MessageSquare, CheckCircle2, Shield } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { useLanguage } from '../context/LanguageContext';

const Contact: FC = () => {
  const { content } = useContent();
  const { lang, t } = useLanguage();
  const c = content.contact;

  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '', subject: '', message: '', isAnonymous: false });
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const methodLabels = {
    ID: {
      title: 'METODE PENGIRIMAN',
      open: 'Terbuka',
      anon: 'Anonim',
    },
    EN: {
      title: 'SENDING METHOD',
      open: 'Public',
      anon: 'Anonymous',
    }
  }[lang as 'ID' | 'EN'] || {
    title: 'METODE PENGIRIMAN',
    open: 'Terbuka',
    anon: 'Anonim',
  };

  const lokasi       = c?.lokasi       || 'Gedung Teknik, Kampus Prodi RKK';
  const jamAktif     = c?.jamAktif     || 'Senin & Kamis, 14.00 – 17.00 WIB';
  const email        = c?.email        || 'bemprkk@email.ac.id';
  const instagram    = c?.instagram    || '@bemprkk';
  const instagramUrl = c?.instagramUrl || '#';
  const mapEmbedUrl  = c?.mapEmbedUrl  || '';
  const mapsUrl      = c?.mapsUrl      || 'https://maps.google.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newMessage = {
      id: Date.now().toString(),
      name: formData.isAnonymous ? 'Anonymous' : (formData.name || 'Anonymous'),
      email: formData.isAnonymous ? '-' : (formData.email || '-'),
      whatsapp: formData.isAnonymous ? '-' : (formData.whatsapp || '-'),
      subject: formData.subject || 'No Subject',
      message: formData.message,
      timestamp: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem('bemprkk_messages') || '[]');
    localStorage.setItem('bemprkk_messages', JSON.stringify([newMessage, ...existing]));

    setIsSending(false);
    setIsSuccess(true);
    setFormData({ name: '', email: '', whatsapp: '', subject: '', message: '', isAnonymous: false });
    setTimeout(() => setIsSuccess(false), 5000);
  };

  const infoItems: { icon: ReactNode; label: string; value: string; href?: string }[] = [
    { icon: <MapPin size={18} />, label: 'LOKASI', value: lokasi, href: mapsUrl },
    { icon: <Clock size={18} />, label: 'JAM AKTIF', value: jamAktif },
    { icon: <Mail size={18} />, label: 'EMAIL', value: email, href: `mailto:${email}` },
    { icon: <Instagram size={18} />, label: 'INSTAGRAM', value: instagram, href: instagramUrl },
  ];

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <motion.div
          className="section-header-block"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="section-badge-pill">{t.contact.subtitle}</span>
          <h2 className="section-title-main">
            {t.contact.title} <span className="text-gradient-elegant">{t.contact.titleGradient}</span>
          </h2>
          <p className="section-desc-main">{t.contact.desc}</p>
        </motion.div>

        <div className="contact-grid">
          {/* FORM */}
          <motion.div
            className="contact-form-panel glass-panel"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="contact-form-header">
              <h3>{t.contact.form.title} <span className="text-gradient-elegant">{t.contact.form.subtitle}</span></h3>
            </div>

            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  className="contact-success-banner"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <CheckCircle2 size={20} /> {t.contact.form.success} — {t.contact.form.successDesc}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="delivery-method-group">
                <span className="delivery-method-label">{methodLabels.title}</span>
                <div className="delivery-method-toggle-container">
                  <button
                    type="button"
                    className={`delivery-method-btn ${!formData.isAnonymous ? 'active' : ''}`}
                    onClick={() => setFormData(p => ({ ...p, isAnonymous: false }))}
                  >
                    <User size={15} />
                    <span>{methodLabels.open}</span>
                    {!formData.isAnonymous && (
                      <motion.div
                        layoutId="activeMethodBg"
                        className="delivery-method-active-bg"
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      />
                    )}
                  </button>
                  <button
                    type="button"
                    className={`delivery-method-btn ${formData.isAnonymous ? 'active' : ''}`}
                    onClick={() => setFormData(p => ({ ...p, isAnonymous: true }))}
                  >
                    <Shield size={15} />
                    <span>{methodLabels.anon}</span>
                    {formData.isAnonymous && (
                      <motion.div
                        layoutId="activeMethodBg"
                        className="delivery-method-active-bg"
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                      />
                    )}
                  </button>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {!formData.isAnonymous && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: 8 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="form-field-row" style={{ paddingBottom: '0.75rem' }}>
                      <div className="form-field">
                        <label><User size={13} /> {t.contact.form.nameLabel}</label>
                        <input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="Nama lengkap" />
                      </div>
                      <div className="form-field">
                        <label><Mail size={13} /> {t.contact.form.emailLabel}</label>
                        <input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} placeholder="email@example.com" />
                      </div>
                    </div>
                    <div className="form-field" style={{ paddingBottom: '0.75rem' }}>
                      <label><Phone size={13} /> {t.contact.form.phoneLabel}</label>
                      <input value={formData.whatsapp} onChange={e => setFormData(p => ({ ...p, whatsapp: e.target.value }))} placeholder="08xxxxxxxxxx" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="form-field">
                <label><MessageSquare size={13} /> {t.contact.form.subjectLabel}</label>
                <input required value={formData.subject} onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))} placeholder="Subjek pesan" />
              </div>
              <div className="form-field">
                <label>{t.contact.form.messageLabel}</label>
                <textarea required value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} placeholder="Tulis pesan atau aspirasi kamu di sini..." rows={5} />
              </div>

              <button type="submit" className="btn-hero-primary contact-submit-btn" disabled={isSending}>
                {isSending ? 'Mengirim...' : <>{t.contact.form.submitBtn} <Send size={16} /></>}
              </button>
            </form>
          </motion.div>

          {/* INFO */}
          <motion.div
            className="contact-info-panel"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="contact-info-items">
              {infoItems.map((item, i) => (
                <motion.div
                  key={i}
                  className="contact-info-item glass-panel"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="contact-info-icon">{item.icon}</div>
                  <div className="contact-info-text">
                    <span className="contact-info-label">{item.label}</span>
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer" className="contact-info-value">
                        {item.value} <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="contact-info-value">{item.value}</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {mapEmbedUrl && (
              <div className="contact-map-wrap glass-panel">
                <iframe src={mapEmbedUrl} title="Lokasi BEMPRKK" allowFullScreen loading="lazy" style={{ width: '100%', height: '220px', border: 0, borderRadius: '12px' }} />
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
