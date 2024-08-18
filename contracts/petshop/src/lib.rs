#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Env, Symbol, symbol_short, String, Address};


#[contracttype]
pub enum DataKey{
    PetAdopter(u32),
}

#[contract]
pub struct Contract;

#[contractimpl]
impl Contract {
    pub fn adopt_pet(env: Env, pet_id: u32, invoker: Address) -> u32 {
        let key = DataKey::PetAdopter(pet_id);
        env.storage().instance().set(&key, &invoker);
        pet_id
    }
    pub fn disown_pet(env: Env, pet_id: u32) {
        let key = DataKey::PetAdopter(pet_id);
        env.storage().instance().remove(&key);
    }
    pub fn get_pet_adopter(env: Env, pet_id: u32) -> Option<Address> {
        let key = DataKey::PetAdopter(pet_id);
        env.storage().instance().get(&key)
    }

} 

// mod test;
