import { useState } from "react";

const questions = [
  { id: 1, text: "新しい企画やサービスのアイデアを考えるのが好きだ", type: "initiator" },
  { id: 2, text: "まだ誰もやっていないことに挑戦したいという気持ちがある", type: "initiator" },
  { id: 3, text: "たとえ周囲のサポートがなくても、自分の信じたことにチャレンジしたい", type: "initiator" },
  { id: 4, text: "誰かの企画に参加し、チームの一員として力を発揮するのが得意だ", type: "member" },
  { id: 5, text: "仲間と一緒に取り組むことで自分の力が最大限に発揮されると感じる", type: "member" },
  { id: 6, text: "自分の専門スキルでチームに貢献したい", type: "member" },
  { id: 7, text: "自分の知見や経験を活かして他人を支援することにやりがいを感じる", type: "supporter" },
  { id: 8, text: "相談に乗ったり、壁打ち相手になることが得意だ", type: "supporter" },
  { id: 9, text: "裏方やアドバイザーとして関わる方が自分には合っていると思う", type: "supporter" },
  { id: 10, text: "周囲の挑戦に共感し、自然と応援したくなる", type: "advocate" },
  { id: 11, text: "よい企画はSNSや口コミで積極的に広めている", type: "advocate" },
  { id: 12, text: "直接関わらなくても、熱量を感じて一体感を味わいたい", type: "advocate" },
];

const resultDetails = {
  initiator: {
    title: "あなたは『起案者タイプ』！",
    description:
      "ビジョンを掲げて、自ら新しい道を切り開くリーダーシップのあるタイプです。あなたの発想力と行動力は、多くの人を巻き込んで新しい価値を生み出す原動力になります。\n\n次のステップ：自分のアイデアを発表したり、共感してくれるメンバーを探してみましょう。",
    image: "/initiator.png",
  },
  member: {
    title: "あなたは『メンバータイプ』！",
    description:
      "誰かの挑戦に共感し、目標達成に向けて力を発揮する協調型の実行者です。チームで動くときにこそ、あなたのスキルや粘り強さが生きてきます。\n\n次のステップ：気になる起案者のアイデアに参加してみましょう。",
    image: "/member.png",
  },
  supporter: {
    title: "あなたは『サポータータイプ』！",
    description:
      "経験や知識を活かして、裏方からチームを支える縁の下の力持ち。起案者やチームの悩みに寄り添い、冷静なアドバイスで導くことができます。\n\n次のステップ：プロジェクトの壁打ち相手や、伴走支援者として関わってみましょう。",
    image: "/supporter.png",
  },
  advocate: {
    title: "あなたは『応援者タイプ』！",
    description:
      "挑戦を見つけて応援し、共感の輪を広げる存在です。あなたの一言が、プロジェクトを動かす後押しになります。\n\n次のステップ：共感した取り組みをシェアしたり、応援の声を届けてみましょう。",
    image: "/advocate.png",
  },
};

export default function DiagnosisApp() {
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const [started, setStarted] = useState(false);

  const handleAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const calculateResult = () => {
    const score = { initiator: 0, member: 0, supporter: 0, advocate: 0 };
    questions.forEach(({ id, type }) => {
      const value = answers[id];
      if (typeof value === "number") score[type] += value;
    });
    return Object.keys(score).reduce((a, b) => (score[a] >= score[b] ? a : b));
  };

  const handleSubmit = async () => {
    const type = calculateResult();
    const payload = {
      name: userInfo.name,
      email: userInfo.email,
      result: type,
      answers,
      timestamp: new Date().toISOString(),
    };
    await fetch("https://script.google.com/macros/s/AKfycbx30W6r5jDSU9OhRjhENjLS4eyrk5kcMDXBhw8hRDBYk7sYuoK2WEKMB6UOs_LrdGa8fQ/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  const renderScale = (id) => (
    <div className="flex justify-between items-center gap-1 mt-2">
      {[1, 2, 3, 4, 5].map((val) => (
        <button
          key={val}
          onClick={() => handleAnswer(id, val)}
          className={`w-10 h-10 rounded-full border text-sm font-medium transition-all duration-150 ${
            answers[id] === val
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400"
          }`}
        >
          {val}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
        {!started ? (
          <>
            <h1 className="text-2xl font-bold mb-4 text-center">あなたに合った挑戦スタイル診断</h1>
            <input
              type="text"
              placeholder="名前"
              className="w-full border rounded px-3 py-2 mb-3"
              value={userInfo.name}
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="メールアドレス"
              className="w-full border rounded px-3 py-2 mb-4"
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
            />
            <button
              className="w-full bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700"
              onClick={() => setStarted(true)}
            >
              診断をはじめる
            </button>
          </>
        ) : showResult ? (
          (() => {
            const type = calculateResult();
            const result = resultDetails[type];
            return (
              <>
                <h2 className="text-2xl font-bold mb-4 text-center">診断結果</h2>
                <img
                  src={result.image}
                  alt={type}
                  className="w-48 h-48 mx-auto mb-4 rounded shadow"
                />
                <h3 className="text-xl font-semibold mb-2 text-center">{result.title}</h3>
                <p className="whitespace-pre-wrap mb-4 text-gray-800 text-sm text-center">{result.description}</p>
                <button
                  onClick={() => {
                    setAnswers({});
                    setShowResult(false);
                    setStarted(false);
                  }}
                  className="w-full mt-4 bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200"
                >
                  もう一度診断する
                </button>
              </>
            );
          })()
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 text-center">12の質問にお答えください</h2>
            <div className="space-y-6">
              {questions.map((q) => (
                <div key={q.id} className="bg-gray-50 border rounded p-4">
                  <p className="text-gray-800 font-medium mb-2">{q.text}</p>
                  {renderScale(q.id)}
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                setShowResult(true);
                handleSubmit();
              }}
              className="w-full mt-6 bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700"
            >
              診断結果をみる
            </button>
          </>
        )}
      </div>
    </div>
  );
}
