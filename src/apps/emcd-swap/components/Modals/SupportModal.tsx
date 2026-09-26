import React, { useEffect, useRef, useState } from 'react';

import { useCreateTicketMutation } from '../../api/coinsApi';

import CloseIcon from '../icons/CloseIcon';
import Loader from '../Loader/Loader';


interface SupportModalProps {
  onClose: () => void;
}
const SupportModal: React.FC<SupportModalProps> = ({ onClose }) => {
  const [createTicket, { isLoading, isSuccess }] = useCreateTicketMutation()
  const modalRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    text: '',
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose])

  useEffect(() => {
    if (isSuccess) {
      onClose()

    }
  }, [isSuccess])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.text || isLoading) {
      return
    }

    createTicket(formData)
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="bg-color-8 rounded-lg p-6 w-137.5 border border-[#D0D0D012]/10"
      >
        <div className="flex justify-end cursor-pointer" onClick={onClose}>
          <CloseIcon />
        </div>

        <div id="modal-title" className="text-2xl text-color-1 font-bold mb-6">
          Нужна помощь?
        </div>

        <div className="flex flex-col gap-y-5">
          <div className="flex flex-col gap-y-1">
            <div className="text-color-3 text-sm font-medium">Имя</div>

            <input
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="w-full outline-none !border !p-4 text-color-1 !rounded-sm !bg-bg-1 hover:!border-brand-hover focus:!border-brand-active !border-[#D0D0D012]/10 transition-all"
              name="name"
              type="text"
              placeholder="Как вас зовут?"
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <div className="text-color-3 text-sm font-medium">Почта</div>

            <input
              onChange={handleChange}
              className="w-full outline-none !border !p-4 text-color-1 !rounded-sm !bg-bg-1 hover:!border-brand-hover focus:!border-brand-active !border-[#D0D0D012]/10 transition-all"
              name="email"
              type="text"
              placeholder="Адрес почты для ответа"
            />
          </div>

          <div className="flex flex-col gap-y-1">
            <div className="text-color-3 text-sm font-medium">Обращение</div>

            <textarea
              onChange={handleChange}
              className="w-full outline-none !border !p-4 text-color-1 !rounded-sm !bg-bg-1 hover:!border-brand-hover focus:!border-brand-active !border-[#D0D0D012]/10 h-50 resize-none transition-all"
              name="text"
              placeholder="Что случилось?"
            />
          </div>
        </div>

        <div className="w-full mt-6">
          <button
            className={`w-full min-h-7 text-color-1 text-sm border p-4 rounded-sm text-center border-bg-35 mt-10 transition-all ${!formData.name || !formData.email || !formData.text || isLoading ? 'bg-transparent' : 'bg-brand'}`}
            onClick={handleSubmit}
          >
            {!isLoading ? 'Отправить' : <Loader />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;