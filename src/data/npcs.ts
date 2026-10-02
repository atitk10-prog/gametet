import { NPC } from '../types/game';

export const NPCS_DATA: { [id: string]: NPC } = {
  ba_nam: {
    id: 'ba_nam',
    name: 'Bà Năm',
    role: 'Người bà kính yêu',
    title: 'Nghệ nhân gói bánh truyền thống',
    x: 480,
    y: 290,
    avatarIcon: '👵',
    color: '#E11D48',
    dialogue: {
      greeting: [
        'Cháu yêu của bà đã về quê ăn Tết rồi đấy à! Cả nhà mong cháu mãi.',
        'Tết năm nay cháu lớn hẳn ra rồi, mau lại đây bà xoa đầu nào!',
      ],
      idle: [
        'Bánh chưng là cái hồn của ngày Tết con ạ. Gạo nếp dẻo thơm, đỗ xanh bùi ngậy, miếng thịt mỡ trong veo.',
        'Lửa luộc bánh phải đượm than, reo tí tách suốt đêm giao thừa thì bánh mới chín rền ngon lành.',
        'Gian nhà Tết dẫu đơn sơ nhưng có cành mai, câu đối đỏ và tiếng cười là ấm áp nhất đời.',
      ],
      questRelated: {
        main_quest_1: 'Cháu ngoan, hãy ra Chợ Tết mua đủ nguyên liệu: Gạo nếp, Đậu xanh, Thịt ba chỉ và Lá dong về đây cho bà nhé!',
        main_quest_2: 'Nguyên liệu đã đủ đầy rồi! Giờ cháu vào góc Bếp lửa, chúng ta cùng gói những chiếc bánh chưng thật vuông vức nào.',
        main_quest_3: 'Bánh chưng đã chín rền thơm nức mũi! Giờ cháu hãy mang về trang hoàng nhà cửa đón giao thừa nhé.',
      },
    },
    questOfferId: 'main_quest_1',
  },

  bac_ba_market: {
    id: 'bac_ba_market',
    name: 'Bác Ba Chợ Tết',
    role: 'Thương gia vui vẻ',
    title: 'Chủ quầy nông sản quê hương',
    x: 1060,
    y: 420,
    avatarIcon: '👨',
    color: '#D97706',
    dialogue: {
      greeting: [
        'A, cháu nhỏ nhà Bà Năm! Ghé sạp bác Ba xem có gạo nếp mới gặt thơm phức này!',
        'Chợ Tết đông vui rộn ràng quá cháu ơi! Bác có đủ gạo, đỗ, lạt tre và hoa đào tươi rói.',
      ],
      idle: [
        'Gạo nếp cái hoa vàng hạt tròn mẩy, đồ xôi hay gói bánh chưng thì dẻo quánh.',
        'Đậu xanh lòng vàng bở tơi, lạt giang ngâm mềm dẻo dai tha hồ gói.',
        'Mua hàng của bác vừa rẻ, vừa được bác đố mấy câu toán vui thử tài trí tuệ nữa đấy!',
      ],
    },
  },

  chu_tu_farmer: {
    id: 'chu_tu_farmer',
    name: 'Chú Tư Nông Dân',
    role: 'Nông dân cần mẫn',
    title: 'Người chăm sóc cánh đồng',
    x: 1420,
    y: 680,
    avatarIcon: '👨‍🌾',
    color: '#16A34A',
    dialogue: {
      greeting: [
        'Chào cháu nhỏ! Cháu ra ngắm lúa xuân đang thì con gái xanh mơn mởn à?',
        'Năm nay mưa thuận gió hòa, lá dong rừng của chú to bản, xanh ngắt một màu!',
      ],
      idle: [
        'Cây lúa nếp gắn bó với người nông dân từ ngàn đời, từng giọt mồ hôi đổi lấy bát cơm thơm.',
        'Muốn hoa nở đẹp ngày Tết, ta phải canh ngày tuốt lá, tưới tắm bằng cả tấm lòng.',
      ],
      questRelated: {
        side_quest_leaves: 'Chú vừa cắt một bó lá dong rừng xanh mướt đây, cháu giúp chú một việc rồi chú tặng cháu nhé!',
      },
    },
  },

  be_mai: {
    id: 'be_mai',
    name: 'Bé Mai',
    role: 'Em bé xóm chợ',
    title: 'Cô bé áo dài hồng',
    x: 640,
    y: 720,
    avatarIcon: '👧',
    color: '#EC4899',
    dialogue: {
      greeting: [
        'Anh/Chị ơi! Anh/Chị có thấy chiếc phong bao lì xì đỏ của em đâu không?',
        'Làng mình năm nay trang hoàng đèn lồng đỏ đẹp quá chừng!',
      ],
      idle: [
        'Em thích nhất là được xem pháo hoa và cùng cả nhà thức canh nồi bánh chưng đêm 30 Tết.',
        'Mẹ mới may cho em chiếc áo dài gấm màu hồng đào có đính hạt ngọc xinh xắn.',
      ],
      questRelated: {
        side_quest_lixi: 'Ôi anh/chị tìm thấy bao lì xì giúp em rồi! Em cảm ơn anh/chị nhiều lắm, em tặng anh/chị điểm Tết may mắn nè!',
      },
    },
  },

  ong_do: {
    id: 'ong_do',
    name: 'Cụ Giáo Đồ',
    role: 'Nhà nho học vấn',
    title: 'Bậc thầy thư pháp đình làng',
    x: 820,
    y: 180,
    avatarIcon: '👴',
    color: '#7C3AED',
    dialogue: {
      greeting: [
        '“Mỗi năm hoa đào nở / Lại thấy ông đồ già...”. Chào mừng cháu hiếu học ghé chốn đình trung!',
        'Nét chữ nết người. Đầu xuân xin chữ là ước mong cho trí tuệ sáng ngời, lòng nhân ái đơm hoa.',
      ],
      idle: [
        'Chữ “Phúc” cầu hạnh phúc ấm no, chữ “Tâm” giữ lòng ngay thẳng, chữ “An” cho cả đời bình yên.',
        'Đình làng ta cổ kính rêu phong, nơi quy tụ bao hội hè dân gian và nét đẹp truyền thống ngàn năm.',
      ],
      questRelated: {
        side_quest_calligraphy: 'Cháu đối được câu này của lão, lão sẽ tặng cháu bức liễn thư pháp dát vàng trang trí phòng khách!',
      },
    },
  },

  cu_ti: {
    id: 'cu_ti',
    name: 'Cu Tí Bạn Nhỏ',
    role: 'Bạn đồng hành',
    title: 'Thần đồng nhặt củi',
    x: 320,
    y: 520,
    avatarIcon: '👦',
    color: '#2563EB',
    dialogue: {
      greeting: [
        'Cậu ơi! Tớ vừa nhặt được mấy khúc củi nhãn khô đượm than mang về cho nồi bánh chưng này!',
        'Chạy đua một vòng quanh làng không? Ai về đích trước được thưởng kẹo gừng!',
      ],
      idle: [
        'Tối nay tớ với cậu cùng thức canh nồi bánh chưng nhé, kể chuyện ma với nướng khoai thơm lừng luôn!',
      ],
    },
  },
};
