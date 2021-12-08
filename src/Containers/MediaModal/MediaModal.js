
import React, { useContext, useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import { MediaModalContext } from '../../Context/MediaModal/MediaModalContextProvider'
// import { BlueCircularCloseButton } from '../../Components/CircularCloseButton/CircularCloseButton'
import './MediaModal.css'
import PDFViwer from './pdfViwer'


export const ContentType = {
    Video: 'video',
    Pdf: 'pdf',
    Image: 'image',
    Iframe: 'iframe',
    Component: 'component',
    FullComponent: 'full_component',
}


export default function MediaModal() {
    const { closeMediaModal, mediaModalStatus, modalDetails } = useContext(MediaModalContext)
    return (
        <>
            {
                mediaModalStatus &&
                <>

                    <div className="mediaModal">
                        <span className={`font mediaModalCloseBtn ${modalDetails.type === ContentType.Component ? 'componentFrameClose' : ''}`} ><b style={{ fontWeight: "bold" }}>X</b> Close</span>
                        {/* {
                            modalDetails.type === ContentType.Iframe &&
                            <BlueCircularCloseButton
                                className={classes.closeBUtton}
                                onClick={(e) => {
                                    if (e) { e.preventDefault() }
                                    closeMediaModal()
                                }}
                            />
                            // <div className="mediaModal_container_closeBtn" onClick={(e) => {
                            //     if (e) { e.preventDefault() }
                            //     closeMediaModal()
                            // }}>
                            // </div>
                        } */}
                        <div className="mediaModalCloser" onClick={(e) => {
                            if (e) { e.preventDefault() }
                            // if (modalDetails.type !== ContentType.Iframe)
                            closeMediaModal()
                        }}></div>
                        <div className={`mediaModal_container ${modalDetails.type === ContentType.Image ? 'mediaModal_container_image' : ''} ${modalDetails.type === ContentType.Iframe ? 'mediaModal_container_iframe' : ''} ${modalDetails.type === ContentType.Pdf ? 'pdf-full' : ''} ${modalDetails.type === ContentType.Component ? 'componentFrame' : ''} 
                        ${modalDetails.type === ContentType.FullComponent ? 'componentFrame componentFrame_Full' : ''}`}
                        // style={modalDetails.type === ContentType.Component ? { width: 'auto' } : {}}
                        >
                            {
                                modalDetails.type === ContentType.Image &&
                                <img src={modalDetails.link} alt="imageLink" />
                            }
                            {
                                modalDetails.type === ContentType.Video &&
                                <ReactPlayer
                                    playing={true}
                                    url={modalDetails.link}
                                    playsinline={true}
                                    volume={0.85}
                                    controls={true}
                                    width='100%'
                                    height='100%'
                                    style={{
                                        background: 'black',
                                        borderRadius: '0.5rem'
                                    }}
                                />
                            }
                            {
                                modalDetails.type === ContentType.Iframe &&
                                <iframe className="iframeViewer" src={modalDetails.link} title="Iframe" allow="camera *;microphone *" />
                            }
                            {
                                modalDetails.type === ContentType.Pdf &&
                                <>
                                    <iframe className="iframeViewer" src={modalDetails.link} title={modalDetails.name} allow="camera *;microphone *" />
                                    {/* <PDFViwer link={modalDetails.link} name={modalDetails.name ?? 'Resource'} /> */}
                                </>

                            }
                            {
                                modalDetails.type === ContentType.Component &&
                                <modalDetails.component data={modalDetails.data} />
                            }
                            {
                                modalDetails.type === ContentType.FullComponent &&
                                <modalDetails.component data={modalDetails.data} />
                            }
                            {
                                modalDetails.type !== ContentType.Component && modalDetails.type !== ContentType.FullComponent &&
                                <div className="mediaModal_container_loader">
                                    <div className="lds-dual-ring"></div>
                                </div>
                            }
                        </div>
                    </div>
                </>
            }
        </>
    )
}
