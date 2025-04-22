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

const resultMessages = {
  initiator: `あなたは『起案者タイプ』！\n\nビジョンを掲げて、自ら新しい道を切り開くリーダーシップのあるタイプです。あなたの発想力と行動力は、多くの人を巻き込んで新しい価値を生み出す原動力になります。\n\n次のステップ：自分のアイデアを発表したり、共感してくれるメンバーを探してみましょう。`,
  member: `あなたは『メンバータイプ』！\n\n誰かの挑戦に共感し、目標達成に向けて力を発揮する協調型の実行者です。チームで動くときにこそ、あなたのスキルや粘り強さが生きてきます。\n\n次のステップ：気になる起案者のアイデアに参加してみましょう。`,
  supporter: `あなたは『サポータータイプ』！\n\n経験や知識を活かして、裏方からチームを支える縁の下の力持ち。起案者やチームの悩みに寄り添い、冷静なアドバイスで導くことができます。\n\n次のステップ：プロジェクトの壁打ち相手や、伴走支援者として関わってみましょう。`,
  advocate: `あなたは『応援者タイプ』！\n\n挑戦を見つけて応援し、共感の輪を広げる存在です。あなたの一言が、プロジェクトを動かす後押しになります。\n\n次のステップ：共感した取り組みをシェアしたり、応援の声を届けてみましょう。`,
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
    await fetch("https://your-endpoint.com/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  if (!started) {
    return (
      <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
        <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>診断スタート前にご入力ください</h2>
          <input
            type="text"
            placeholder="名前"
            style={{ width: "100%", marginBottom: 12, padding: 8 }}
            value={userInfo.name}
            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="メールアドレス"
            style={{ width: "100%", marginBottom: 12, padding: 8 }}
            value={userInfo.email}
            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
          />
          <button onClick={() => setStarted(true)} style={{ width: "100%", padding: 10, background: "black", color: "white" }}>
            診断をはじめる
          </button>
        </div>
      </div>
    );
  }

  if (showResult) {
    const type = calculateResult();
    return (
      <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
        <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 24 }}>
          <h2 style={{ fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 16 }}>診断結果</h2>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 16 }}>{resultMessages[type]}</pre>
          <button onClick={() => { setAnswers({}); setShowResult(false); setStarted(false); }} style={{ width: "100%", marginTop: 16, padding: 10, background: "black", color: "white" }}>
            もう一度診断する
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 600, margin: "0 auto" }}>
      <div style={{ marginBottom: 24, textAlign: "center" }}>
        <h1 style={{ fontSize: 28, fontWeight: "bold" }}>あなたに合った参加スタイルを診断</h1>
        <p style={{ color: "#555" }}>簡単な質問に答えて、あなたの適性をチェックしましょう！</p>
      </div>
      {questions.map((q) => (
        <div key={q.id} style={{ border: "1px solid #eee", borderRadius: 8, padding: 16, marginBottom: 12 }}>
          <p style={{ marginBottom: 8, fontWeight: "bold" }}>{q.text}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                onClick={() => handleAnswer(q.id, val)}
                style={{ padding: "6px 12px", background: answers[q.id] === val ? "black" : "white", color: answers[q.id] === val ? "white" : "black", border: "1px solid black", borderRadius: 4 }}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      ))}
      <button onClick={() => { setShowResult(true); handleSubmit(); }} style={{ width: "100%", padding: 12, background: "black", color: "white", fontSize: 16 }}>
        診断結果をみる
      </button>
    </div>
  );
}
