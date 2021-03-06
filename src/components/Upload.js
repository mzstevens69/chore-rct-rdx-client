import React, { useState } from 'react';
import Alert from './Alert';


const Upload = () => {
    const [fileInputState, setFileInputState] = useState('');
    const [previewSource, setPreviewSource] = useState('');
    const [selectedFile, setSelectedFile] = useState();
    const [successMsg, setSuccessMsg] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [url, setUrl] = useState('')


    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        previewFile(file);
        setSelectedFile(file);
        setFileInputState(e.target.value);
        
    };

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        };
        
    };
    
    const handleSubmitFile = (e) => {
        e.preventDefault();

        if (!selectedFile) return;
        
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = () => {
            uploadImage(reader.result);
        };
        reader.onerror = () => {
            console.error('mistakes were made');
            setErrMsg('something went wrong!');
        };
        
    };

    const uploadImage = async (base64EncodedImage) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/chore/image`, {
                method: 'POST',                
                body: JSON.stringify({ data: base64EncodedImage }),
                type: 'cors',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin'
            });
            setUrl(res.img_url)
            setFileInputState('');
            setPreviewSource('');
            setSuccessMsg('Image uploaded successfully');
            
        } catch (err) {
            console.error(err);
            setErrMsg('Something went wrong!');
        }
    };
    console.log(url)
    return (
        <div>
            
            <h1 className="title">Upload Chore Image</h1>
            <Alert msg={errMsg} type="danger" />
            <Alert msg={successMsg} type="success" />
            <form onSubmit={handleSubmitFile} className="form">
                <input
                    id="fileInput"
                    type="file"
                    name="image"
                    onChange={handleFileInputChange}
                    value={fileInputState}
                    className="form-input"
                />
                {/* <button className="btn" type="submit">
                    Upload Image First
                </button> */}
            </form>
            {previewSource && (
                <img
                    src={previewSource}
                    alt="chosen"
                    style={{ height: '300px' }}
                />
            )}
        </div>
    );
    

}
export default Upload;