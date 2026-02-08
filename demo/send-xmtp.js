import 'dotenv/config';
import { Client } from '@xmtp/xmtp-js';

const client = await Client.create({
  env: 'production',
  privateKey: process.env.XMTP_WALLET_KEY
});

const agentAddress = '你的Agent地址';
const conversation = await client.conversations.newConversation(agentAddress);
await conversation.send('pay Txyz... 1');
console.log('sent');