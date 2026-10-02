import React, { useState } from 'react';
import { sound } from '../../services/sound';
import { ChevronRight, ChevronLeft, Check, Sparkles, X } from 'lucide-react';

interface TutorialModalProps {
  onComplete: () => void;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  onComplete,
  onClose,
}) => {
  const [step, setStep] = useState<number>(0);

  const tutorialSteps = [
    {
      title: 'Chào mừng em về quê ăn Tết!',
      desc: 'Mùa xuân Giáp Thìn đã gõ cửa mọi nhà. Em vừa trở về quê sum vầy cùng gia đình và người làng. Ngôi nhà đang chờ em chung tay chuẩn bị cho một cái Tết no ấm!',
      icon: '🏮',
      tip: 'Nhấn "Tiếp theo" để tìm hiểu cách chơi nhé!',
    },
    {
      title: '1. Khám phá làng Tết 2D',
      desc: 'Dùng các phím W-A-S-D hoặc Mũi tên trên bàn phím, cần điều khiển ảo (nếu dùng điện thoại), hoặc chạm trực tiếp vào bất cứ đâu trên bản đồ để di chuyển nhân vật.',
      icon: '🗺️',
      tip: 'Các lối tắt dưới màn hình giúp em đến nhanh từng khu vực!',
    },
    {
      title: '2. Nhận nhiệm vụ từ Bà Năm',
      desc: 'Bà Năm đang đứng đợi em ở sân trước hiên nhà. Hãy chạy đến gần bà và nhấn phím [E] hoặc chạm nút "Tương tác" để nhận nhiệm vụ "Sắm sửa nguyên liệu Tết".',
      icon: '👵',
      tip: 'Bà sẽ hướng dẫn em từng bí quyết truyền thống quý giá.',
    },
    {
      title: '3. Đi Chợ Tết & Giải Đố Mua Hàng',
      desc: 'Rảo bước sang phía Đông tới Chợ Tết nhộn nhịp. Gặp Bác Ba để mua Gạo nếp, Đậu xanh, Thịt ba chỉ và Lá dong. Khi mua, Bác Ba sẽ đố em những câu toán vui thú vị!',
      icon: '🏪',
      tip: 'Trả lời đúng sẽ nhận thêm Xu và Điểm Tết may mắn!',
    },
    {
      title: '4. Tự tay gói Bánh Chưng tại Bếp lửa',
      desc: 'Mang đủ nguyên liệu về Bếp lửa hồng. Thực hiện đủ 8 công đoạn: Xếp lá, đố vui tỷ lệ, rải 5 tầng nhân, gấp mép vuông vắn, buộc lạt và canh nồi luộc bập bùng!',
      icon: '🍲',
      tip: 'Một chiếc bánh vuông vức hoàn hảo đang chờ em trổ tài.',
    },
    {
      title: '5. Trang hoàng nhà cửa đón Giao Thừa',
      desc: 'Trở về nhà, chọn chậu mai vàng nở rộ, cành đào thắm, treo đôi câu đối đỏ thư pháp và bày đĩa bánh chưng vừa nấu lên bàn trà đón năm mới cát tường!',
      icon: '🏠',
      tip: 'Bố cục nhà được tự động lưu lại vẹn nguyên sau mỗi lần trang trí.',
    },
  ];

  const current = tutorialSteps[step];

  const handleNext = () => {
    sound.playClick();
    if (step + 1 < tutorialSteps.length) {
      setStep(step + 1);
    } else {
      sound.playQuestComplete();
      onComplete();
    }
  };

  const handlePrev = () => {
    sound.playClick();
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm select-none animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-amber-50 to-orange-50 w-full max-w-lg rounded-3xl border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-amber-600 to-yellow-600 px-5 py-3 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{current.icon}</span>
            <h2 className="text-base font-black tracking-wide text-amber-100 uppercase">
              Hướng Dẫn Khám Phá ({step + 1}/{tutorialSteps.length})
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Card */}
        <div className="p-6 text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-4xl shadow-inner animate-bounce">
            {current.icon}
          </div>

          <h3 className="text-lg font-black text-stone-900 leading-tight">
            {current.title}
          </h3>

          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
            {current.desc}
          </p>

          <div className="p-3 bg-amber-100/80 rounded-2xl border border-amber-300 text-xs font-bold text-amber-900">
            💡 {current.tip}
          </div>
        </div>

        {/* Footer controls */}
        <div className="bg-amber-100/70 border-t border-amber-200 px-5 py-3 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors ${
              step === 0 ? 'text-stone-400 opacity-50 cursor-not-allowed' : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            <ChevronLeft size={16} />
            <span>Quay lại</span>
          </button>

          <div className="flex gap-1.5">
            {tutorialSteps.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === step ? 'w-5 bg-red-600' : 'bg-amber-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-5 py-2 bg-gradient-to-r from-red-600 to-amber-600 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>{step + 1 === tutorialSteps.length ? 'Vào Game Ngay!' : 'Tiếp theo'}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
