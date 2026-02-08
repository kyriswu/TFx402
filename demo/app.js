import express from 'express';
import { server } from 'tron-x402';

const { x402Gate } = server;

const app = express();

app.use(express.json());

const SELLER_ADDRESS = 'TUzz9HKrE5sgzn5RmGKG35caEyqvawoKga';
const RESOURCE_PRICE = 1;

app.get(
	'/premium-data',
	x402Gate({
		recipient: SELLER_ADDRESS,
		price: RESOURCE_PRICE,
		asset: 'USDT',
		network: 'tron:0x2b6653dc',
	}),
	(req, res) => {
		console.log('【test info】', req.payment);
		console.log(`[Success] Payment verified for Invoice: ${req.payment.invoiceId}`);
		res.json({
			status: 'success',
			data: '这里是价值 1 USDT 的核心付费数据...',
			receipt: {
				txId: req.payment.txId,
				from: req.payment.from,
				invoiceId: req.payment.invoiceId,
				amount: req.payment.value,
			},
		});
	}
);

const port = 4444;

app.listen(port, () => {
	console.log(`API server listening on port ${port}`);
});
