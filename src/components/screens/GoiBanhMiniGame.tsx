import React, { useState, useEffect } from 'react';
import { sound } from '../../services/sound';
import confetti from 'canvas-confetti';
import { Sparkles, Flame, CheckCircle, ChevronRight, RotateCcw, X } from 'lucide-react';

interface GoiBanhMiniGameProps {
  inventory: { [itemId: string]: number };
  onCompleteCooking: (result: { stars: number; exp: number; coins: number; tetPoints: number }) => void;
  onClose: () => void;
}

export const GoiBanhMiniGame: React.FC<GoiBanhMiniGameProps> = ({
  inventory,
  onCompleteCooking,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Ingredient check
  const hasRice = (inventory['gao_nep'] || 0) > 0;
  const hasBeans = (inventory['dau_xanh'] || 0) > 0;
  const hasPork = (inventory['thit_ba_chi'] || 0) > 0;
  const hasLeaves = (inventory['la_dong'] || 0) > 0;
  const hasAllIngredients = hasRice && hasBeans && hasPork && hasLeaves;

  // Step 2: Leaves placed (needs 4)
  const [placedLeavesCount, setPlacedLeavesCount] = useState<number>(0);

  // Step 3: Quiz in cooking context
  const [step3Answered, setStep3Answered] = useState<boolean>(false);
  const [step3Selected, setStep3Selected] = useState<number | null>(null);

  // Step 4: Layer assembly (Gạo 1 -> Đỗ 1 -> Thịt -> Đỗ 2 -> Gạo 2)
  const [layers, setLayers] = useState<string[]>([]);
  const targetLayers = ['Gạo nếp', 'Đậu xanh', 'Thịt ba chỉ', 'Đậu xanh', 'Gạo nếp'];

  // Step 5: Fold corners
  const [foldedCorners, setFoldedCorners] = useState<number>(0);

  // Step 6: Tie string (lat giang)
  const [tiedStrings, setTiedStrings] = useState<number>(0);

  // Step 7: Boil timer
  const [boilProgress, setBoilProgress] = useState<number>(0);
  const [isBoiling, setIsBoiling] = useState<boolean>(false);

  // Boil timer simulation
  useEffect(() => {
    let timer: any;
    if (isBoiling && boilProgress < 100) {
      timer = setInterval(() => {
        setBoilProgress((prev) => {
          if (prev >= 98) {
            clearInterval(timer);
            setIsBoiling(false);
            setCurrentStep(8);
            sound.playQuestComplete();
            confetti({
              particleCount: 80,
              spread: 80,
              origin: { y: 0.5 },
              colors: ['#10B981', '#F59E0B', '#EF4444', '#3B82F6'],
            });
            return 100;
          }
          sound.playBubble();
          return prev + 6;
        });
      }, 250);
    }
    return () => clearInterval(timer);
  }, [isBoiling, boilProgress]);

  // Handle layer click in Step 4
  const handleAddLayer = (type: string) => {
    if (layers.length >= targetLayers.length) return;
    const nextExpected = targetLayers[layers.length];
    if (type === nextExpected) {
      sound.playClick();
      setLayers([...layers, type]);
      if (layers.length + 1 === targetLayers.length) {
        sound.playCorrect();
      }
    } else {
      sound.playWrong();
    }
  };

  const resetMiniGame = () => {
    setCurrentStep(1);
    setPlacedLeavesCount(0);
    setStep3Answered(false);
    setStep3Selected(null);
    setLayers([]);
    setFoldedCorners(0);
    setTiedStrings(0);
    setBoilProgress(0);
    setIsBoiling(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-amber-50 to-orange-50 w-full max-w-2xl rounded-3xl border-4 border-amber-400 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-green-700 to-amber-700 px-5 py-3 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍲</span>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-wide text-amber-200 uppercase">
                Góc Bếp Xưa – Kỳ Công Gói Bánh Chưng
              </h2>
              <div className="text-xs text-emerald-200 font-medium">
                Bước {currentStep}/8: {
                  currentStep === 1 ? 'Chuẩn Bị Nguyên Liệu' :
                  currentStep === 2 ? 'Xếp Lá Vào Khuôn' :
                  currentStep === 3 ? 'Trắc Nghiệm Tỷ Lệ' :
                  currentStep === 4 ? 'Rải 5 Tầng Nguyên Liệu' :
                  currentStep === 5 ? 'Gấp Mép Lá Vuông Vắn' :
                  currentStep === 6 ? 'Buộc Lạt Giang Chữ Thập' :
                  currentStep === 7 ? 'Nổi Lửa Luộc Bánh' :
                  'Thành Phẩm Mỹ Mãn!'
                }
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetMiniGame}
              className="p-1.5 rounded-xl bg-black/20 hover:bg-black/40 text-amber-200 transition-colors"
              title="Làm lại từ đầu"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-black/20 hover:bg-black/40 text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-stone-200 h-2 flex">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <div
              key={s}
              className={`flex-1 transition-all duration-300 ${
                s <= currentStep ? 'bg-gradient-to-r from-emerald-500 to-amber-500' : 'bg-stone-300'
              } border-r border-white/50`}
            />
          ))}
        </div>

        {/* Main Content Area */}
        <div className="p-5 flex-1 overflow-y-auto flex flex-col items-center justify-center min-h-[360px]">
          {/* STEP 1: CHỌN NGUYÊN LIỆU */}
          {currentStep === 1 && (
            <div className="w-full text-center space-y-4">
              <div className="text-sm sm:text-base font-bold text-stone-800">
                Hãy kiểm tra và chuẩn bị đủ 4 nguyên liệu truyền thống trước khi bắt đầu:
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className={`p-3 rounded-2xl border-2 ${hasRice ? 'bg-emerald-50 border-emerald-400' : 'bg-stone-100 border-dashed border-stone-300'}`}>
                  <div className="text-3xl">🌾</div>
                  <div className="font-extrabold text-xs mt-1">Gạo nếp hoa vàng</div>
                  <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                    {hasRice ? '✅ Đã sẵn sàng' : '❌ Chưa có (mua ở chợ)'}
                  </div>
                </div>

                <div className={`p-3 rounded-2xl border-2 ${hasBeans ? 'bg-emerald-50 border-emerald-400' : 'bg-stone-100 border-dashed border-stone-300'}`}>
                  <div className="text-3xl">🌱</div>
                  <div className="font-extrabold text-xs mt-1">Đậu xanh tiêu</div>
                  <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                    {hasBeans ? '✅ Đã đãi sạch vỏ' : '❌ Chưa có (mua ở chợ)'}
                  </div>
                </div>

                <div className={`p-3 rounded-2xl border-2 ${hasPork ? 'bg-emerald-50 border-emerald-400' : 'bg-stone-100 border-dashed border-stone-300'}`}>
                  <div className="text-3xl">🥩</div>
                  <div className="font-extrabold text-xs mt-1">Thịt ba chỉ ướp tiêu</div>
                  <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                    {hasPork ? '✅ Đã ướp tiêu thơm' : '❌ Chưa có (mua ở chợ)'}
                  </div>
                </div>

                <div className={`p-3 rounded-2xl border-2 ${hasLeaves ? 'bg-emerald-50 border-emerald-400' : 'bg-stone-100 border-dashed border-stone-300'}`}>
                  <div className="text-3xl">🍃</div>
                  <div className="font-extrabold text-xs mt-1">Lá dong & Dây lạt</div>
                  <div className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                    {hasLeaves ? '✅ Đã rửa sạch' : '❌ Chưa có'}
                  </div>
                </div>
              </div>

              {hasAllIngredients ? (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setCurrentStep(2);
                    }}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-extrabold text-sm sm:text-base shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 mx-auto cursor-pointer"
                  >
                    <span>Bắt Đầu Xếp Lá Vào Khuôn</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-amber-100 border border-amber-300 rounded-xl text-xs text-amber-900 font-medium">
                  💡 Bạn còn thiếu nguyên liệu. Hãy ghé Chợ Tết gặp Bác Ba hoặc Chú Tư để mua đủ nhé!
                </div>
              )}
            </div>
          )}

          {/* STEP 2: XẾP LÁ DONG VÀO KHUÔN */}
          {currentStep === 2 && (
            <div className="w-full text-center space-y-4">
              <div className="text-sm sm:text-base font-bold text-stone-800">
                Chạm vào các cạnh để xếp 4 chiếc lá dong đan chéo chữ thập vào khuôn gỗ:
              </div>

              {/* Wooden Mold Visual */}
              <div className="relative w-48 h-48 mx-auto bg-amber-800/80 border-8 border-amber-900 rounded-2xl shadow-inner flex items-center justify-center overflow-hidden">
                {/* Leaves layers visual */}
                {placedLeavesCount >= 1 && (
                  <div className="absolute inset-x-2 inset-y-6 bg-emerald-600/90 rounded transform -rotate-6 shadow-md" />
                )}
                {placedLeavesCount >= 2 && (
                  <div className="absolute inset-y-2 inset-x-6 bg-emerald-700/90 rounded transform rotate-6 shadow-md" />
                )}
                {placedLeavesCount >= 3 && (
                  <div className="absolute inset-x-3 inset-y-5 bg-emerald-600/95 rounded transform rotate-45 shadow-md" />
                )}
                {placedLeavesCount >= 4 && (
                  <div className="absolute inset-x-4 inset-y-4 bg-emerald-800 rounded shadow-inner flex items-center justify-center">
                    <span className="text-white text-xs font-bold bg-black/40 px-2 py-1 rounded">
                      Khuôn lá hoàn chỉnh!
                    </span>
                  </div>
                )}

                {placedLeavesCount < 4 && (
                  <div className="text-amber-200 text-xs font-extrabold z-10">
                    Đã xếp: {placedLeavesCount}/4 lá
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => {
                    if (placedLeavesCount < 4) {
                      sound.playTone(440 + placedLeavesCount * 80, 'sine', 0.15, 0.1);
                      setPlacedLeavesCount(placedLeavesCount + 1);
                      if (placedLeavesCount + 1 === 4) {
                        sound.playCorrect();
                        setTimeout(() => setCurrentStep(3), 800);
                      }
                    }
                  }}
                  disabled={placedLeavesCount >= 4}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-md transition-all active:scale-95 cursor-pointer disabled:bg-stone-300"
                >
                  🍃 Xếp Lá Dong Tiếp Theo (+1)
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: TRẮC NGHIỆM TỶ LỆ TRUYỀN THỐNG */}
          {currentStep === 3 && (
            <div className="w-full space-y-4 text-center">
              <div className="inline-block px-3 py-1 bg-amber-200 text-amber-900 rounded-full text-xs font-extrabold">
                Bà Năm hỏi nhỏ cháu yêu
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-stone-800">
                “Tại sao khi gói bánh chưng, ta lại để nhân thịt và đỗ xanh ở chính giữa, còn gạo nếp bọc kín bên ngoài?”
              </h3>

              <div className="space-y-2 max-w-md mx-auto text-left">
                {[
                  { text: 'A. Để thịt và đỗ chín đều, hòa quyện hương vị thơm bùi vào từng hạt nếp', correct: true },
                  { text: 'B. Chỉ vì cho đẹp mắt, không có tác dụng gì cả', correct: false },
                  { text: 'C. Để bánh dễ bị khô và cứng', correct: false },
                ].map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setStep3Selected(idx);
                      setStep3Answered(true);
                      if (opt.correct) {
                        sound.playCorrect();
                        setTimeout(() => setCurrentStep(4), 1000);
                      } else {
                        sound.playWrong();
                      }
                    }}
                    className={`w-full p-3 rounded-2xl border-2 text-xs sm:text-sm font-bold text-left transition-all cursor-pointer ${
                      step3Answered && opt.correct
                        ? 'bg-emerald-500 text-white border-emerald-600'
                        : step3Answered && step3Selected === idx && !opt.correct
                        ? 'bg-rose-500 text-white border-rose-600'
                        : 'bg-white hover:bg-amber-100 text-stone-800 border-amber-300'
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: RẢI 5 TẦNG NGUYÊN LIỆU */}
          {currentStep === 4 && (
            <div className="w-full text-center space-y-4">
              <div className="text-sm sm:text-base font-bold text-stone-800">
                Nhấn vào các nút nguyên liệu theo đúng thứ tự 5 tầng truyền thống:
              </div>

              {/* Cake cross-section container */}
              <div className="w-60 h-44 mx-auto bg-emerald-800 border-4 border-emerald-950 rounded-2xl p-2.5 flex flex-col justify-end gap-1 shadow-xl">
                {layers.map((layer, idx) => (
                  <div
                    key={idx}
                    className={`h-6 rounded-lg font-black text-xs flex items-center justify-center shadow-sm animate-in slide-in-from-top-2 ${
                      layer === 'Gạo nếp'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : layer === 'Đậu xanh'
                        ? 'bg-yellow-400 text-yellow-950 border border-yellow-500'
                        : 'bg-rose-400 text-rose-950 border border-rose-600'
                    }`}
                  >
                    {layer === 'Gạo nếp' ? '🌾 Lớp Gạo nếp' : layer === 'Đậu xanh' ? '🌱 Lớp Đậu xanh bùi' : '🥩 Nhân Thịt tiêu'}
                  </div>
                ))}
                {layers.length === 0 && (
                  <div className="text-emerald-200 text-xs font-medium my-auto">
                    Khuôn bánh đang sẵn sàng...
                  </div>
                )}
              </div>

              <div className="text-xs font-bold text-stone-600">
                Tầng kế tiếp cần rải: <span className="text-amber-700 underline font-black">{targetLayers[layers.length] || 'Đã hoàn thành!'}</span>
              </div>

              {/* Ingredient Buttons */}
              <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
                <button
                  onClick={() => handleAddLayer('Gạo nếp')}
                  className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold border-2 border-amber-400 text-xs sm:text-sm cursor-pointer shadow-sm active:scale-95"
                >
                  🌾 Gạo nếp
                </button>
                <button
                  onClick={() => handleAddLayer('Đậu xanh')}
                  className="px-3.5 py-2 rounded-xl bg-yellow-200 hover:bg-yellow-300 text-yellow-900 font-extrabold border-2 border-yellow-500 text-xs sm:text-sm cursor-pointer shadow-sm active:scale-95"
                >
                  🌱 Đậu xanh
                </button>
                <button
                  onClick={() => handleAddLayer('Thịt ba chỉ')}
                  className="px-3.5 py-2 rounded-xl bg-rose-200 hover:bg-rose-300 text-rose-900 font-extrabold border-2 border-rose-500 text-xs sm:text-sm cursor-pointer shadow-sm active:scale-95"
                >
                  🥩 Thịt ba chỉ
                </button>
              </div>

              {layers.length === targetLayers.length && (
                <button
                  onClick={() => {
                    sound.playClick();
                    setCurrentStep(5);
                  }}
                  className="px-5 py-2.5 bg-emerald-600 text-white font-extrabold rounded-2xl shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  Tiếp Tục: Gấp Mép Lá
                </button>
              )}
            </div>
          )}

          {/* STEP 5: GẤP MÉP LÁ VUÔNG VẮN */}
          {currentStep === 5 && (
            <div className="w-full text-center space-y-4">
              <div className="text-sm sm:text-base font-bold text-stone-800">
                Gấp đều 4 góc mép lá dong lại để gói chặt nhân bánh:
              </div>

              <div className="relative w-48 h-48 mx-auto bg-emerald-900 border-4 border-emerald-950 rounded-2xl flex items-center justify-center shadow-xl">
                <div className="w-36 h-36 bg-emerald-700 border-2 border-emerald-500 rounded-xl relative overflow-hidden flex items-center justify-center">
                  <span className="text-amber-200 font-extrabold text-xs">
                    {foldedCorners}/4 mép đã gấp
                  </span>

                  {/* Corner flaps */}
                  {foldedCorners >= 1 && <div className="absolute top-0 inset-x-0 h-6 bg-emerald-800 border-b border-emerald-600" />}
                  {foldedCorners >= 2 && <div className="absolute bottom-0 inset-x-0 h-6 bg-emerald-800 border-t border-emerald-600" />}
                  {foldedCorners >= 3 && <div className="absolute left-0 inset-y-0 w-6 bg-emerald-850 border-r border-emerald-600" />}
                  {foldedCorners >= 4 && <div className="absolute right-0 inset-y-0 w-6 bg-emerald-850 border-l border-emerald-600" />}
                </div>
              </div>

              <button
                onClick={() => {
                  if (foldedCorners < 4) {
                    sound.playTone(500 + foldedCorners * 60, 'sine', 0.15, 0.1);
                    setFoldedCorners(foldedCorners + 1);
                    if (foldedCorners + 1 === 4) {
                      sound.playCorrect();
                      setTimeout(() => setCurrentStep(6), 800);
                    }
                  }
                }}
                disabled={foldedCorners >= 4}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-md cursor-pointer active:scale-95 disabled:bg-stone-300"
              >
                📐 Gấp Mép Góc Lá (+1)
              </button>
            </div>
          )}

          {/* STEP 6: BUỘC LẠT GIANG CHỮ THẬP */}
          {currentStep === 6 && (
            <div className="w-full text-center space-y-4">
              <div className="text-sm sm:text-base font-bold text-stone-800">
                Dùng 2 dây lạt giang buộc chặt bánh hình chữ thập vuông vắn:
              </div>

              <div className="relative w-48 h-48 mx-auto bg-emerald-700 border-4 border-emerald-900 rounded-2xl shadow-xl flex items-center justify-center">
                {/* Horizontal String */}
                {tiedStrings >= 1 && (
                  <div className="absolute inset-x-0 h-4 bg-amber-200 border-y-2 border-amber-500 shadow-sm" />
                )}
                {/* Vertical String */}
                {tiedStrings >= 2 && (
                  <div className="absolute inset-y-0 w-4 bg-amber-200 border-x-2 border-amber-500 shadow-sm" />
                )}
                {tiedStrings === 2 && (
                  <div className="w-6 h-6 rounded-full bg-amber-300 border-2 border-amber-600 z-10 shadow" />
                )}

                <span className="text-xs font-bold text-emerald-100 bg-black/40 px-2.5 py-1 rounded-full z-10">
                  {tiedStrings}/2 đường lạt
                </span>
              </div>

              <button
                onClick={() => {
                  if (tiedStrings < 2) {
                    sound.playTone(600 + tiedStrings * 150, 'triangle', 0.2, 0.15);
                    setTiedStrings(tiedStrings + 1);
                    if (tiedStrings + 1 === 2) {
                      sound.playCorrect();
                      setTimeout(() => setCurrentStep(7), 800);
                    }
                  }
                }}
                disabled={tiedStrings >= 2}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-2xl shadow-md cursor-pointer active:scale-95 disabled:bg-stone-300"
              >
                🎗️ Buộc Dây Lạt Giang (+1)
              </button>
            </div>
          )}

          {/* STEP 7: NỔI LỬA LUỘC BÁNH */}
          {currentStep === 7 && (
            <div className="w-full text-center space-y-4">
              <div className="text-sm sm:text-base font-bold text-stone-800">
                Xếp bánh vào nồi gang, thêm nước ngập mặt bánh và châm lửa đun sôi:
              </div>

              {/* Fire & Cauldron Visual */}
              <div className="relative w-52 h-44 mx-auto flex flex-col items-center justify-center">
                <div className="w-40 h-28 bg-stone-800 border-4 border-stone-900 rounded-b-3xl relative overflow-hidden flex items-center justify-center shadow-2xl">
                  {/* Boiling water bubbles */}
                  {isBoiling && (
                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-around">
                      <div className="w-3 h-3 rounded-full bg-white/70 animate-bounce" />
                      <div className="w-4 h-4 rounded-full bg-white/70 animate-bounce delay-100" />
                      <div className="w-2 h-2 rounded-full bg-white/70 animate-bounce delay-200" />
                    </div>
                  )}
                  <span className="text-3xl">🟩</span>
                </div>

                {/* Flames underneath */}
                <div className="flex gap-2 -mt-2">
                  <Flame size={28} className={`${isBoiling ? 'text-orange-500 animate-pulse' : 'text-stone-400'}`} />
                  <Flame size={36} className={`${isBoiling ? 'text-red-500 animate-bounce' : 'text-stone-400'}`} />
                  <Flame size={28} className={`${isBoiling ? 'text-amber-400 animate-pulse' : 'text-stone-400'}`} />
                </div>
              </div>

              {/* Progress bar */}
              <div className="max-w-xs mx-auto">
                <div className="flex justify-between text-xs font-bold text-stone-600 mb-1">
                  <span>Thời gian luộc</span>
                  <span>{boilProgress}%</span>
                </div>
                <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden border border-stone-300">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 transition-all duration-200"
                    style={{ width: `${boilProgress}%` }}
                  />
                </div>
              </div>

              {!isBoiling && boilProgress === 0 && (
                <button
                  onClick={() => {
                    setIsBoiling(true);
                    sound.playTone(300, 'sawtooth', 0.4, 0.1);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-amber-600 hover:brightness-110 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl active:scale-95 transition-all flex items-center gap-2 mx-auto cursor-pointer"
                >
                  <Flame size={18} />
                  <span>Nổi Lửa Luộc Bánh Ngay!</span>
                </button>
              )}
            </div>
          )}

          {/* STEP 8: THÀNH PHẨM HOÀN HẢO */}
          {currentStep === 8 && (
            <div className="w-full text-center space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-emerald-600 to-green-800 p-2 border-4 border-amber-300 shadow-2xl flex items-center justify-center transform hover:rotate-6 transition-transform">
                <span className="text-5xl">🟩</span>
              </div>

              <div>
                <span className="inline-block px-3 py-1 bg-amber-400 text-red-900 rounded-full text-xs font-black uppercase tracking-wider mb-1">
                  🎉 GÓI BÁNH HOÀN HẢO!
                </span>
                <h3 className="text-lg sm:text-xl font-black text-emerald-900">
                  Chiếc Bánh Chưng Xanh Vuông Vức Đã Hoàn Thành!
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto mt-1">
                  Màu xanh mướt của lá dong, hạt nếp dẻo thơm quyện cùng vị bùi của đậu xanh và thịt ba chỉ ướp tiêu đượm đà hồn quê Việt.
                </p>
              </div>

              {/* Rewards Box */}
              <div className="bg-amber-100/80 border-2 border-amber-300 rounded-2xl p-3.5 max-w-sm mx-auto flex items-center justify-around text-xs sm:text-sm font-extrabold text-amber-900">
                <div className="flex items-center gap-1">
                  <span>🪙</span>
                  <span>+60 xu</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>⭐</span>
                  <span>+120 EXP</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>🧧</span>
                  <span>+30 Điểm Tết</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-800">
                  <span>🟩</span>
                  <span>+1 Bánh Chưng</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    sound.playCoin();
                    onCompleteCooking({ stars: 3, exp: 120, coins: 60, tetPoints: 30 });
                  }}
                  className="px-7 py-3 bg-gradient-to-r from-emerald-600 to-green-700 hover:brightness-110 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl active:scale-95 transition-all flex items-center gap-2 mx-auto cursor-pointer"
                >
                  <Sparkles size={18} />
                  <span>Nhận Thưởng & Đem Về Nhà</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
