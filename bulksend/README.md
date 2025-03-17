# BulkSend Smart Contract

- Install the dependencies:
   ```bash
   npm install
   ```

- Add **PRIVATEKEY** inside `.env`:
   ```env
   # ENTER YOUR PRIVATE KEY
   PRIVATE_KEY=your_private_key_here
   ```

- Compile the smart contract:
    ```bash
    npm run compile
    ```

---

### Deploy the Contract

- Deploy the contract to the Monad Testnet:
    ```bash
    npm run deploy
    ```
    After deployment, the contract address will be automatically added to `.env` file under `CONTRACT_ADDRESS`.

#

### Distribute Native Tokens
```bash
npm run distribute
```

#### What Happens?
1. The script reads recipient addresses from `addresses.txt` (one address per line).
2. It prompts for the amount of native tokens to send to each recipient.
3. It lists the recipient addresses and asks for confirmation before proceeding.
4. If confirmed, it sends the tokens and logs the transaction hash.

