import { Quest } from '../types/game';

export const INITIAL_QUESTS: { [id: string]: Quest } = {
  main_quest_1: {
    id: 'main_quest_1',
    title: 'Nhiệm vụ 1: Sắm sửa nguyên liệu Tết',
    description: 'Bà Năm dặn dò ra Chợ Tết mua đầy đủ 4 nguyên liệu chính để gói bánh chưng: Gạo nếp, Đậu xanh, Thịt ba chỉ và Lá dong.',
    type: 'main',
    npcId: 'ba_nam',
    status: 'available',
    objectives: [
      { id: 'mq1_talk_grandma', description: 'Nói chuyện với Bà Năm ở sân nhà', current: 0, required: 1, completed: false, type: 'talk', targetId: 'ba_nam' },
      { id: 'mq1_buy_rice', description: 'Đến Chợ Tết mua Gạo nếp cái hoa vàng (1 túi)', current: 0, required: 1, completed: false, type: 'buy', targetId: 'gao_nep' },
      { id: 'mq1_buy_beans', description: 'Mua Đậu xanh lòng vàng từ Bác Ba (1 túi)', current: 0, required: 1, completed: false, type: 'buy', targetId: 'dau_xanh' },
      { id: 'mq1_buy_pork', description: 'Mua Thịt ba chỉ tươi ướp tiêu (1 phần)', current: 0, required: 1, completed: false, type: 'buy', targetId: 'thit_ba_chi' },
      { id: 'mq1_buy_leaves', description: 'Mua hoặc nhận Lá dong rừng xanh (1 bó)', current: 0, required: 1, completed: false, type: 'buy', targetId: 'la_dong' },
      { id: 'mq1_return_grandma', description: 'Mang đầy đủ nguyên liệu về báo cáo với Bà Năm', current: 0, required: 1, completed: false, type: 'talk', targetId: 'ba_nam' },
    ],
    rewards: {
      coins: 60,
      exp: 100,
      tetPoints: 30,
      items: [
        { itemId: 'lat_giang', count: 4 },
        { itemId: 'cui_lua', count: 2 },
      ],
    },
  },

  main_quest_2: {
    id: 'main_quest_2',
    title: 'Nhiệm vụ 2: Kỳ công gói Bánh Chưng truyền thống',
    description: 'Vào khu Bếp lửa, cùng Bà Năm thực hiện từng bước xếp lá, đong gạo, tra đỗ, rải thịt, gói vuông vức và nhóm lửa luộc bánh.',
    type: 'main',
    npcId: 'ba_nam',
    status: 'locked',
    unlockCondition: {
      requiredQuestId: 'main_quest_1',
    },
    objectives: [
      { id: 'mq2_enter_kitchen', description: 'Bước vào khu Bếp lửa hồng', current: 0, required: 1, completed: false, type: 'explore', targetId: 'kitchen_zone' },
      { id: 'mq2_fold_leaves', description: 'Xếp 4 chiếc lá dong chữ thập vào khuôn', current: 0, required: 1, completed: false, type: 'cook' },
      { id: 'mq2_answer_ratio', description: 'Trả lời đúng câu hỏi tỷ lệ nguyên liệu', current: 0, required: 1, completed: false, type: 'answer' },
      { id: 'mq2_fill_layers', description: 'Rải chuẩn các tầng: Gạo - Đỗ - Thịt - Đỗ - Gạo', current: 0, required: 1, completed: false, type: 'cook' },
      { id: 'mq2_tie_lat', description: 'Gấp mép lá vuông vắn và buộc lạt giang chữ thập', current: 0, required: 1, completed: false, type: 'cook' },
      { id: 'mq2_boil_cake', description: 'Nổi lửa đun sôi nồi bánh chưng thơm nức', current: 0, required: 1, completed: false, type: 'cook' },
    ],
    rewards: {
      coins: 100,
      exp: 180,
      tetPoints: 50,
      items: [
        { itemId: 'banh_chung', count: 2 },
        { itemId: 'cau_doi_do', count: 1 },
      ],
    },
  },

  main_quest_3: {
    id: 'main_quest_3',
    title: 'Nhiệm vụ 3: Trang hoàng tổ ấm đón Giao Thừa',
    description: 'Trở về nhà, bày cành mai vàng rực rỡ, treo đèn lồng đỏ, câu đối chữ nho và bày đĩa bánh chưng xanh đón Tết sum vầy.',
    type: 'main',
    npcId: 'ba_nam',
    status: 'locked',
    unlockCondition: {
      requiredQuestId: 'main_quest_2',
    },
    objectives: [
      { id: 'mq3_enter_home', description: 'Trở về ngôi nhà của em', current: 0, required: 1, completed: false, type: 'explore', targetId: 'home_zone' },
      { id: 'mq3_place_flower', description: 'Đặt một chậu Hoa Mai hoặc Cành Đào trong nhà', current: 0, required: 1, completed: false, type: 'decorate' },
      { id: 'mq3_place_lantern', description: 'Treo Đèn Lồng đỏ hoặc Câu Đối trước cửa', current: 0, required: 1, completed: false, type: 'decorate' },
      { id: 'mq3_place_cake', description: 'Bày chiếc Bánh Chưng xanh lên bàn trà', current: 0, required: 1, completed: false, type: 'decorate' },
    ],
    rewards: {
      coins: 120,
      exp: 250,
      tetPoints: 80,
      items: [
        { itemId: 'mam_ngu_qua', count: 1 },
        { itemId: 'phong_bao_li_xi', count: 3 },
      ],
    },
  },

  // SIDE QUESTS
  side_quest_lixi: {
    id: 'side_quest_lixi',
    title: 'Nhiệm vụ phụ: Chiếc phong bao thất lạc',
    description: 'Bé Mai chạy nhảy làm rơi chiếc phong bao lì xì may mắn ở gần Vườn hoa xuân. Hãy tìm và mang lại cho em.',
    type: 'side',
    npcId: 'be_mai',
    status: 'available',
    objectives: [
      { id: 'sq1_talk_mai', description: 'Hỏi thăm Bé Mai xem em làm rơi đồ ở đâu', current: 0, required: 1, completed: false, type: 'talk', targetId: 'be_mai' },
      { id: 'sq1_find_envelope', description: 'Tìm chiếc phong bao đỏ ở khu Vườn hoa xuân', current: 0, required: 1, completed: false, type: 'explore', targetId: 'chest_garden' },
      { id: 'sq1_return_mai', description: 'Trao lại chiếc phong bao cho Bé Mai', current: 0, required: 1, completed: false, type: 'talk', targetId: 'be_mai' },
    ],
    rewards: {
      coins: 40,
      exp: 70,
      tetPoints: 25,
      items: [{ itemId: 'mut_tet', count: 1 }],
    },
  },

  side_quest_leaves: {
    id: 'side_quest_leaves',
    title: 'Nhiệm vụ phụ: Đố vui cùng Chú Tư Nông Dân',
    description: 'Ghé thăm Chánh đồng quê, trò chuyện với Chú Tư và trả lời câu đố về thiên nhiên, cây cối để nhận lá dong tươi.',
    type: 'side',
    npcId: 'chu_tu_farmer',
    status: 'available',
    objectives: [
      { id: 'sq2_talk_tu', description: 'Gặp gỡ Chú Tư ở bìa cánh đồng lúa', current: 0, required: 1, completed: false, type: 'talk', targetId: 'chu_tu_farmer' },
      { id: 'sq2_answer_farmer', description: 'Trả lời đúng câu hỏi khoa học của Chú Tư', current: 0, required: 1, completed: false, type: 'answer' },
    ],
    rewards: {
      coins: 45,
      exp: 80,
      tetPoints: 30,
      items: [{ itemId: 'la_dong', count: 3 }],
    },
  },

  side_quest_calligraphy: {
    id: 'side_quest_calligraphy',
    title: 'Nhiệm vụ phụ: Xin chữ Cụ Đồ ở Đình Làng',
    description: 'Lên Đình Làng cổ kính bái kiến Cụ Đồ, giải câu đối ca dao để xin liễn thư pháp mừng xuân.',
    type: 'side',
    npcId: 'ong_do',
    status: 'available',
    objectives: [
      { id: 'sq3_visit_hall', description: 'Ghé thăm Cụ Đồ tại Đình Làng', current: 0, required: 1, completed: false, type: 'talk', targetId: 'ong_do' },
      { id: 'sq3_answer_proverb', description: 'Giải câu đối ca dao Tết của Cụ Đồ', current: 0, required: 1, completed: false, type: 'answer' },
    ],
    rewards: {
      coins: 50,
      exp: 90,
      tetPoints: 35,
      items: [{ itemId: 'cau_doi_do', count: 1 }],
    },
  },
};
