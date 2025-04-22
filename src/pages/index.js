import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
  initiator: `あなたは『起案者タイプ』！\n\n
ビジョンを掲げて、自ら新しい道を切り開くリーダーシップのあるタイプです。あなたの発想力と行動力は、多くの人を巻き込んで新しい価値を生み出す原動力になります。\n\n次のステップ：自分のアイデアを発表したり、共感してくれるメンバーを探してみましょう。`,
  member: `あなたは『メンバータイプ』！\n\n
誰かの挑戦に共感し、目標達成に向けて力を発揮する協調型の実行者です。チームで動くときにこそ、あなたのスキルや粘り強さが生きてきます。\n\n次のステップ：気になる起案者のアイデアに参加してみましょう。`,
  supporter: `あなたは『サポータータイプ』！\n\n
経験や知識を活かして、裏方からチームを支える縁の下の力持ち。起案者やチームの悩みに寄り添い、冷静なアドバイスで導くことができます。\n\n次のステップ：プロジェクトの壁打ち相手や、伴走支援者として関わってみましょう。`,
  advocate: `あなたは『応援者タイプ』！\n\n
挑戦を見つけて応援し、共感の輪を広げる存在です。あなたの一言が、プロジェクトを動かす後押しになります。\n\n次のステップ：共感した取り組みをシェアしたり、応援の声を届けてみましょう。`,
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
    const topType = Object.keys(score).reduce((a, b) => (score[a] >= score[b] ? a : b));
    return topType;
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
      <div className="p-6 max-w-xl mx-auto">
        <Card className="shadow-lg rounded-2xl">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">診断スタート前にご入力ください</h2>
            <input
              type="text"
              placeholder="名前"
              className="w-full mb-4 p-2 border rounded"
              value={userInfo.name}
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="メールアドレス"
              className="w-full mb-4 p-2 border rounded"
              value={userInfo.email}
              onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
            />
            <Button className="w-full" onClick={() => setStarted(true)}>診断をはじめる</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResult) {
    const type = calculateResult();
    return (
      <div className="p-6 max-w-xl mx-auto">
        <Card className="shadow-lg rounded-2xl">
          <CardContent className="p-6 whitespace-pre-line">
            <h2 className="text-3xl font-bold mb-4 text-center text-primary">診断結果</h2>
            <p className="text-lg text-center">{resultMessages[type]}</p>
            <Button className="mt-6 w-full" onClick={() => { setAnswers({}); setShowResult(false); setStarted(false); }}>もう一度診断する</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold mb-2">あなたに合った参加スタイルを診断</h1>
        <p className="text-gray-600">簡単な質問に答えて、あなたの適性をチェックしましょう！</p>
      </div>
      {questions.map((q) => (
        <Card key={q.id} className="mb-4 shadow-sm border">
          <CardContent className="p-4">
            <p className="mb-3 text-base font-medium">{q.text}</p>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <Button
                  key={val}
                  variant={answers[q.id] === val ? "default" : "outline"}
                  onClick={() => handleAnswer(q.id, val)}
                >
                  {val}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
      <Button className="mt-6 w-full text-lg" onClick={() => { setShowResult(true); handleSubmit(); }}>診断結果をみる</Button>
    </div>
  );
}
