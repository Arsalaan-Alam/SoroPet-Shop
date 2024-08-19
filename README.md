## SoroPet Shop


In this tutorial, I’ve built a fully functional Pet Shop application on the Stellar blockchain using Soroban smart contracts. The Pet Shop is a familiar concept for many developers, especially those coming from Ethereum’s ecosystem, but this tutorial reimagines it on the Stellar network using Soroban, a new smart contract platform. The application allows users to adopt and disown pets, with ownership stored on the blockchain. This tutorial guides developers step-by-step on how to create, deploy, and interact with smart contracts on Stellar using Rust & React providing a comprehensive introduction to building decentralized applications on Soroban.

The Petshop contract contains three primary functions that manage pet adoption on the blockchain:

1. **adopt_pet**: This function allows a user to adopt a pet by storing the adopter's address on the blockchain using the pet's unique ID.
   
2. **disown_pet**: This function enables a user to disown a pet, removing the ownership information from the blockchain for that specific pet ID.

3. **get_pet_adopter**: This function retrieves the address of the current adopter for a given pet ID, allowing anyone to check the ownership status of a pet.

Additionally, the contract includes:

- **DataKey enum**: This defines a storage key in the contract, specifically used to map each pet's unique ID to its adopter's address on the blockchain. 

On the frontend, there are three primary functions that interact with the smart contract:

1. **fetchAllPetOwners()**: This function retrieves the current owner of each pet by invoking the `get_pet_adopter` method on the contract. It iterates through all the pets, fetches the adopter's address for each pet from the blockchain, and updates the state with this information.

2. **adoptPet()**: This function allows a user to adopt a pet by invoking the `adopt_pet` method on the contract. It sends the pet's ID and the user's address to the contract, storing the adoption on the blockchain. The function also handles state updates and user notifications.

3. **disownPet()**: This function enables a user to disown a pet by invoking the `disown_pet` method on the contract. It sends the pet's ID to the contract, which then removes the adoption record from the blockchain. The function also manages state changes and user feedback.

## Setup

When deploying our contracts, you will need the secret key of the deployer account. This secret key will be stored in an ignored file located at `./contracts/.env`.

### Steps to Set Up Your Env

1. Copy the example environment file:
   ```bash
   cp contracts/.env.example contracts/.env
   ```
   If you are already inside the `contracts` folder (e.g., inside the Docker Container), simply run:
   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file, which will look like this:
   ```bash
   # Stellar accounts Secret Keys
   ADMIN_SECRET_KEY=

   # RPC Setup
   MAINNET_RPC_URL=
   ```

3. Generate new Accounts and Private Keys from [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test).
4. Find a Mainnet RPC Provider from the [Ecosystem](https://developers.stellar.org/docs/data/rpc/rpc-providers)


### Deploy the Contract
Here is the content formatted in Markdown for a GitHub README:

```markdown


1. **Move to the contracts folder:**
   ```bash
   cd contracts
   ```

2. **Build the project:**
   ```bash
   make build
   ```

3. **Install dependencies and deploy the contract:**
   ```bash
   yarn install
   yarn deploy testnet greeting
   ```
```
