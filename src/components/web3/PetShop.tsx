import { Button, Card, FormControl, FormLabel, Input, Stack, Image, SimpleGrid, Text, Box} from '@chakra-ui/react'
import { type FC, useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import 'twin.macro'

import { useSorobanReact } from "@soroban-react/core"
import * as StellarSdk from '@stellar/stellar-sdk';

import React from 'react'
import Link from 'next/link'

import { contractInvoke, useRegisteredContract } from '@soroban-react/contracts'
import { nativeToScVal, xdr, scValToNative } from '@stellar/stellar-sdk'
import petsData from '@/components/web3/pets.json'

export const PetShop: FC = () => {
    const [pets, setPets] = useState(petsData);
    const sorobanContext = useSorobanReact();
    const { address } = sorobanContext;
    const contract = useRegisteredContract("petshop");
    const [contractAddressStored, setContractAddressStored] = useState<string>();
    const [petAdopterStatus, setPetAdopterStatus] = useState<Record<number, string | null>>({});
    const [isAdopting, setIsAdopting] = useState<Record<number, boolean>>({});
    const [isDisowning, setIsDisowning] = useState<Record<number, boolean>>({});
    

    const fetchAllPetOwners = useCallback(async () => {
        if (!sorobanContext.server) return;
        const currentChain = sorobanContext.activeChain?.name?.toLowerCase();
        if (!currentChain) {
            console.log("No active chain")
            toast.error('Wallet not connected. Try again…')
            return
          }
          const contractAddress = contract?.deploymentInfo.contractAddress;
          setContractAddressStored(contractAddress)

          try {
            const fetchPromises = pets.map(async (pet) => {
                const id = pet.id;
                const result = await contract?.invoke({
                    method: 'get_pet_adopter',
                    args: [
                        nativeToScVal(id, {type: 'u32'}),  
                    ], 
                });
                const adopter = scValToNative(result as xdr.ScVal) as string | null;
                console.log(adopter)
                setPetAdopterStatus(prevStatus => ({
                    ...prevStatus,
                    [id]: adopter || null,
                }));
                await Promise.all(fetchPromises);
            })
        } catch (error){
            console.log(error);
        }
    }, [sorobanContext, contract]);

    useEffect(() => {
        fetchAllPetOwners();
    }, [fetchAllPetOwners]);

    const adoptPet = useCallback(async (id: number) => {
        if (!sorobanContext.server) return
        const currentChain = sorobanContext.activeChain?.name?.toLowerCase();
        if (!currentChain) {
            console.log("No active chain")
            toast.error('Wallet not connected. Try again…')
            return
          }
          else {
            setIsAdopting(prevState => ({ ...prevState, [id]: true}));
            const contractAddress = contract?.deploymentInfo.contractAddress;
            setContractAddressStored(contractAddress);
            try {
                await contract?.invoke({
                    method: 'adopt_pet',
                    args: [
                        nativeToScVal(id, {type: 'u32'}),
                        nativeToScVal(address, {type: 'address'})
                    ],
                    signAndSend: true
            });
            toast.success('Pet adopted successfully');
            setIsAdopting(prevState => ({...prevState, [id]: false}))
        } catch (error) {
            console.error(error);
            toast.error('Failed to adopt pet, pls login');
            setIsAdopting(prevState => ({...prevState, [id]: false}))
          }
        }
        }, [contract, address, sorobanContext]);

        const disownPet = useCallback(async (id: number) => {
            if (!sorobanContext.server) return
            const currentChain = sorobanContext.activeChain?.name?.toLowerCase();
            if (!currentChain) {
                console.log("No active chain")
                toast.error('Wallet not connected. Try again…')
                return
              }
              else {
                setIsDisowning(prevState => ({ ...prevState, [id]: true}));
                const contractAddress = contract?.deploymentInfo.contractAddress;
                setContractAddressStored(contractAddress);
                try {
                    await contract?.invoke({
                        method: 'disown_pet',
                        args: [
                            nativeToScVal(id, {type: 'u32'}),  
                        ],
                        signAndSend: true
                });
                toast.success('Pet disowned successfully');
                setIsDisowning(prevState => ({...prevState, [id]: false}))
            } catch (error) {
                console.error(error);
                toast.error('Failed to disown pet :(');
              }
            }
            }, [contract, address, sorobanContext]);
    

    return (
        <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
            {pets.map((pet) => (
                <Card key={pet.id} padding={4} borderWidth="1px" borderRadius="lg" overflow="hidden">
                    <Image src={pet.picture} alt={pet.name} marginBottom={5} objectFit="cover" />
                    <Text fontWeight="bold" fontSize="xl">
                        {pet.name}
                    </Text>
                    <Text>Breed: {pet.breed}</Text>
                    <Text>Age: {pet.age} years old</Text>
                    <Text>Location: {pet.location}</Text>
                    {petAdopterStatus[pet.id] === address ? (
                    <Button colorScheme="yellow" mt={4} onClick={() => disownPet(pet.id)}>
                        {isDisowning[pet.id] ? `Disowning ${pet.name}...` : `Disown ${pet.name}`}
                        </Button>
            ):
             petAdopterStatus[pet.id] ? (
                <>
                <Button bg = "red.400" color= "white" mt={4} 
                _hover = {{bg:"red.400", cursor: "not-allowed"}}
                _active = {{bg:"red.400"}}>
                Already Adopted 
                </Button>
                <Box textAlign="center" mt={2}>
                    <Link href = {`https://stellar.expert/explorer/testnet/account/${petAdopterStatus[pet.id]}`}
                    target='_blank' color="blue.500">
                    View Owner 
                    </Link>
                </Box>
                </>
             ): (
                <Button colorScheme='teal' mt={4} onClick={() => adoptPet(pet.id)}>
                    {isAdopting[pet.id] ? `Adopting ${pet.name}...` : `Adopt ${pet.name}`}
                </Button>
             )}


                </Card>
            ))}
        </SimpleGrid>
    )
}
