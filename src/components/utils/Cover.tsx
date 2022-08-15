import React from "react";
import PropTypes from "prop-types";
import {Button} from "react-bootstrap";



const Cover = ({name, login, coverImg}: {name: string, login: any, coverImg: any}) => {
    if ((name && login && coverImg)) {
        return (
            <div
                className=""
            >
                <div className="">
                    {/*<div*/}
                    {/*    className=" ratio ratio-1x1 mx-auto mb-2"*/}
                    {/*    style={{maxWidth: "320px"}}*/}
                    {/*>*/}
                    {/*    <img src={coverImg} alt="" style={{*/}
                    {/*        objectFit: 'cover'*/}
                    {/*    }}/>*/}
                    {/*</div>*/}
                    <h1>{name}</h1>
                    <p>Please connect your wallet to continue.</p>
                    <Button
                        onClick={login}
                        variant="outline-light"
                        className="rounded-pill px-3 mt-3"
                    >
                        Connect Wallet
                    </Button>
                </div>
                <p className="">Powered by NEAR</p>
            </div>
        );
    }
    return null;
};

export default Cover;
