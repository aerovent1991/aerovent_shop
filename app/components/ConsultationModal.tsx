"use client";
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type ContactMethod = 'phone' | 'signal' | 'viber' | 'whatsapp';

export function ConsultationModal() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [question, setQuestion] = useState('');
  const [contactMethod, setContactMethod] = useState<ContactMethod>('phone');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setName('');
    setPhone('');
    setQuestion('');
    setContactMethod('phone');
    setError(null);
    setSuccess(false);
  };

  const close = () => {
    setOpen(false);
    resetForm();
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    let rest = digits.startsWith('380') ? digits.slice(3) : digits;
    rest = rest.slice(0, 9);

    const p1 = rest.slice(0, 2);
    const p2 = rest.slice(2, 5);
    const p3 = rest.slice(5, 7);
    const p4 = rest.slice(7, 9);

    let formatted = '+380';
    if (p1) formatted += ` ${p1}`;
    if (p2) formatted += ` ${p2}`;
    if (p3) formatted += ` ${p3}`;
    if (p4) formatted += ` ${p4}`;
    return formatted;
  };

  const handlePhoneChange = (value: string) => {
    setPhone(formatPhone(value));
  };

  const isPhoneValid = (value: string) => {
    const cleaned = value.replace(/\s+/g, '');
    return /^\+380\d{9}$/.test(cleaned);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!isPhoneValid(phone)) {
        setError('Невірний формат телефону. Приклад: +380XXXXXXXXX');
        setLoading(false);
        return;
      }

      const res = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          question,
          contactMethod
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data?.error || 'Помилка відправки');
      } else {
        setSuccess(true);
      }
    } catch {
      setError('Помилка відправки');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <button
        className="bg-transparent border border-white/20 hover:border-aero-accent text-white hover:text-aero-accent font-bold py-3 px-8 tactical-clip uppercase tracking-wider transition-all text-center"
        onClick={() => setOpen(true)}
      >
        Отримати консультацію
      </button>

      {open && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6">
          <button
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={close}
            aria-label="Закрити форму"
          />
          <div className="relative z-10 w-full max-w-4xl bg-black/95 border border-white/10 rounded-xl p-6 md:p-10 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl md:text-3xl font-stencil text-white">
                Бажаєте замовити консультацію?
              </h2>
              <button
                onClick={close}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Закрити"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-400 mb-4 md:mb-6">
              Заповніть форму нижче і ми звʼяжемось із вами для детального обговорення вашого запиту.
            </p>

            {success ? (
              <div className="text-center py-10">
                <div className="text-aero-accent text-xl font-bold mb-2">
                  Дякуємо! Заявку відправлено.
                </div>
                <p className="text-gray-400 mb-6">Ми звʼяжемось з вами найближчим часом.</p>
                <button
                  onClick={close}
                  className="bg-aero hover:bg-aero-light text-white font-bold py-3 px-8 tactical-clip uppercase tracking-wider transition-all"
                >
                  Закрити
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4 flex-1 flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Імʼя</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-black/50 border border-white/10 text-white px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Телефон</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      onFocus={() => {
                        if (!phone) setPhone('+380');
                      }}
                      required
                      inputMode="numeric"
                      placeholder="+380 97 345 30 56"
                      className="w-full bg-black/50 border border-white/10 text-white px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Ваше питання</label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                    rows={3}
                    className="w-full bg-black/50 border border-white/10 text-white px-3 py-2 resize-none"
                  />
                </div>

                <div>
                  <div className="text-sm text-gray-300 mb-2">
                    Як з вами краще контактувати?
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {([
                      { label: 'Телефон', value: 'phone' },
                      { label: 'Signal', value: 'signal' },
                      { label: 'Viber', value: 'viber' },
                      { label: 'WhatsApp', value: 'whatsapp' },
                    ] as const).map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-2 border px-3 py-2 text-sm cursor-pointer transition-colors ${
                          contactMethod === opt.value
                            ? 'border-aero-accent text-white bg-aero/10'
                            : 'border-white/10 text-gray-400 hover:border-white/30'
                        }`}
                      >
                        <input
                          type="radio"
                          name="contactMethod"
                          value={opt.value}
                          checked={contactMethod === opt.value}
                          onChange={() => setContactMethod(opt.value)}
                          className="accent-aero-accent"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="text-red-400 text-sm">{error}</div>
                )}

                <div className="flex justify-end gap-3 pt-2 mt-auto">
                  <button
                    type="button"
                    onClick={close}
                    className="border border-white/20 text-gray-300 hover:text-white px-5 py-2 transition-colors"
                  >
                    Скасувати
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-aero hover:bg-aero-light text-white font-bold px-6 py-2 tactical-clip uppercase tracking-wider transition-all disabled:opacity-60"
                  >
                    {loading ? 'Надсилаємо...' : 'Відправити'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
