"use client";

import { formatNumber, roundLocalNumber, scrollToSection } from '@/app/lib/utils';
import { experience, whatsappContact } from '@/app/variables';
import React from 'react';


const PriceCard = () => {
  return (
    <section id="precio" className="relative pb-14 px-4 overflow-hidden bg-[#1D1616] text-white">
      <div className="max-w-4xl mx-auto">
        {/* Price Card */}
        <div className="bg-black/50 rounded-xl border border-white/10 relative shadow-xl mt-8">
          {/* Corner badge - final version */}
          <div className="absolute -top-6 -right-6 bg-[#DC0073] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-xl z-10 uppercase tracking-wider ring-2 ring-white/10">
            Bono para primeros valientes
          </div>

          <div className="p-8">
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-6">Experiencia Completa</h3>

              {/* Price display */}
              <div className="mb-6">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-gray-300 text-3xl line-through">
                    {roundLocalNumber(experience.price.amountInCents / 100 / (1 - experience.price.promoApplied.percentage / 100), 3)}
                    {` ${experience.price.currency}`}
                  </span>
                  <span className="bg-[#DC0073]/20 text-[#DC0073] px-4 py-2 rounded-md text-xl font-bold">
                    Descuento {experience.price.promoApplied.percentage}%
                  </span>
                </div>
                <div className="flex items-baseline justify-center mt-4">
                  <span className="text-6xl md:text-7xl font-bold">{formatNumber(experience.price.amountInCents / 100)}</span>
                  <span className="ml-2 text-2xl text-gray-300">{experience.price.currency}</span>
                </div>
                <p className="text-xl text-gray-300 mt-2">Pago único</p>
              </div>

              {/* Availability with progress bar */}
              <div className="mb-6">
                <p className="text-base text-gray-200 mb-3">Cupo exclusivo de 20 personas</p>
              </div>

              {/* Bonus */}
              <div className="text-left bg-[#DC0073]/10 rounded-lg p-4 mb-6 border border-[#DC0073]/20">
                <p className="text-[#DC0073] text-lg font-bold mb-2">Bono primeros valientes:</p>
                <p className="text-base text-gray-200">Sesión canalizada del oráculo donde tus guías espirituales te brindaran claridad y guía para los primeros 3 inscritos.</p>
              </div>


              {/* WhatsApp Contact Button */}
              <div className="mt-6 pt-6 border-t border-white/5">
              </div>
              <button
                onClick={() => {
                  window.open(`https://wa.me/${whatsappContact.number}?text=${whatsappContact.message}`, '_blank', 'noopener,noreferrer');
                }}
                className="w-full bg-[#DC0073] text-white py-4 px-6 rounded-lg text-lg font-bold hover:bg-[#DC0073]/90 transition-colors flex items-center justify-center space-x-3 shadow-lg hover:shadow-[#DC0073]/30"
              >
                {/* <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787" />
                </svg> */}
                <p className="text-2xl">Reserva tu lugar</p>
                <span className="text-xl">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceCard;