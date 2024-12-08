const express = require("express"); // Express をインポート
const { createCanvas } = require("canvas"); // Canvas ライブラリをインポート

const app = express(); // Express アプリケーションを作成
const PORT = 3000; // ポート番号

// メインのエンドポイント
app.get("/", (req, res) => {
  const { s } = req.query; // クエリパラメータ `s` を取得

  // 日付が指定されていない場合はエラーを返す
  if (!s) {
    return res
      .status(400)
      .send(
        "日付が指定されていません。クエリパラメータに?s=YYYY-MM-DDを指定してください。"
      );
  }

  // 入力された日付を Date 型に変換
  const startDate = new Date(s);
  if (isNaN(startDate.getTime())) {
    return res
      .status(400)
      .send(
        "日付の形式が正しくありません。YYYY-MM-DD の形式で指定してください。"
      );
  }

  // 現在の日付との経過月数を計算
  const currentDate = new Date();
  const diffMonths =
    (currentDate.getFullYear() - startDate.getFullYear()) * 12 +
    (currentDate.getMonth() - startDate.getMonth());

  if (diffMonths < 0) {
    return res.status(400).send("未来の日付はサポートされていません。");
  }

  let canvasWidth = 0;
  if (diffMonths <= 10) {
    canvasWidth = 18
  } else if (diffMonths <= 100) {
    canvasWidth = 33
  } else {
    canvasWidth = 50
  }

  // 画像生成
  const canvas = createCanvas(canvasWidth, 30); // キャンバスを作成
  const ctx = canvas.getContext("2d");

  // 背景色を設定
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, 30, 30);

  // テキストを描画
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText(`${diffMonths}`, 0, 25);

  // HTTP ヘッダーを設定して画像を返す
  res.setHeader("Content-Type", "image/png");
  canvas.createPNGStream().pipe(res); // PNG 形式で出力
});

// サーバーの起動
app.listen(PORT, () => {
  console.log(`サーバーが起動しました: http://localhost:${PORT}`);
});
