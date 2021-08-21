import React, { useEffect, useState } from 'react'
import { BiImageAdd, BiChevronLeft } from "react-icons/bi";
import { NavLink ,useHistory} from 'react-router-dom';
import Web3 from 'web3'
import nft  from  '../abi/nft.json'
import {collectionlist} from './nftdata'
const IPFS = require('ipfs-api');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });


function Createcollection() {

    const [img, setimg] = useState();
    const [buffer, setbuffer] = useState();
    const history = useHistory()
   
    const [displayimage, setdisplayimg] = useState();
    console.log("image", img);
    const [data, setdata] = useState({
        collectionName: "", displayName: "", websiteUrl: "", collectionDescription: "", marketFee: ""
    })
    
    // useEffect(()=>{connectwallte},[]) 

    useEffect(()=>{console.log("prince")},[]);

    //const [name,setname] = useState()
    //console.log(name);
    
    const submit = async (e) => {
        e.preventDefault()
        console.log("data", data.collectionName);
        await ipfs.add(buffer,(error,result)=>{
            console.log("ipfs result",result[0].hash);
            console.log(result[0].hash);
            swaps(result[0].hash);
            if(error)
            {
                console.error(error)
                return;
            }
        })
    }

    const choosepic = (e) => {
        setimg(e.target.files[0])
        const file = e.target.files[0];
        const render = new FileReader()
        render.onload =  () => {
            if (render.readyState === 2) {
                setdisplayimg(render.result)
            }
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
          const buffer =  Buffer.from(reader.result);
          setbuffer(buffer);
          console.log('buffer', buffer)
        }
        }
        render.readAsDataURL(e.target.files[0])
    }

     
    const swaps = async (e) =>
    {   
        if (window.ethereum)
        {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        //  console.log(accounts);
        let userwalletaddresss = accounts[0];
        window.web3 = new Web3(window.ethereum);
        let  swaping = new window.web3.eth.Contract(nft,'0xBDE025C87B0851c50290531aa0F9D4800bb1e18A')
        
        swaping.methods.createcollection(data.collectionName,data.displayName,data.websiteUrl,data.collectionDescription,e,parseInt(data.marketFee)).send({from:userwalletaddresss})
        .then((fees)=>
        {
              console.log(fees);
              if(fees.status===true){
                  history.push('/create')
              } 

        }).catch() 
        }
    }
    


    return (
        <div className="createcollection">
            <div className="container">
                <div className="row">
                    <div className="col-md-7 col-12 headingl">
                        <NavLink to="/create" ><BiChevronLeft /> My Collections</NavLink>
                        <h2>Create New Collection</h2>
                        <h3>Create your collection first. Then you’ll create your schemas and assets.</h3>

                    </div>
                    <div className="col-md-7 col-12 headingr">

                    </div>

                </div>
                <form onSubmit={submit}>
                <div className="row">

                    <div className="col-md-3 col-12 mb-5 px-3">
                    
                        <div className="nftcard">

                            <label for="actual-btn">
                                <div className="mnftcard ">
                                    {
                                        
                                       // <img src={`https://ipfs.infura.io/ipfs/${hash}`} className="img-fluid" />
                                                  
                                       displayimage ? <img src={displayimage} className="img-fluid" /> :
                                            <>
                                                <BiImageAdd />
                                                <h3>Add a collection photo</h3>
                                                <p>Transparent backgrounds are recommended if possible</p>
                                            </>
                                    }



                                </div>
                            </label>
                            <input type="file" id="actual-btn" className="d-none" onChange={choosepic} required />

                        </div>

                    </div>
                    <div className="col-md-9 col-12 px-5">



                        


                            <div className="nftcreatecard">
                                <div className="row">
                                    <div className="col-md-6 col-12">
                                        <label>Collection Name <br />(12 Character, 1-5 & a-z)</label>
                                        {/* <input type="text" onChange={(e) => setname(e.target.value)} required /> */}
                                        <input type="text" onChange={(e) => setdata({ ...data, collectionName: e.target.value })} required />
                                        <label>Display Name</label>
                                        <input type="text" onChange={(e) => setdata({ ...data, displayName: e.target.value })} required />
                                        <label>Website URL</label>
                                        <input type="text" onChange={(e) => setdata({ ...data, websiteUrl: e.target.value })} required />
                                    </div>
                                    <div className="col-md-6 col-12">
                                        <label>Collection Description</label>
                                        <textarea onChange={(e) => setdata({ ...data, collectionDescription: e.target.value })} required />
                                        <label>Market Fee (0% - 15%)</label>
                                        <input type="Number" onChange={(e) => setdata({ ...data, marketFee: e.target.value })} required />
                                        <div className=" nftcbtn">
                                            <button type="submit">Mint NFT</button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        
                    </div>
                    

                </div>
                </form>
            </div>
            
            {/* <button onClick={collectionlist}>Click</button> */}

        </div>
    )
}

export default Createcollection
