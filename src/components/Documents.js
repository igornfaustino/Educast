import React, { useState, useEffect } from 'react';
import './Documents.scss';
import { FaLink } from 'react-icons/fa';
import { AiFillFolderOpen } from 'react-icons/ai';
import { BsTrashFill } from 'react-icons/bs';
import { TiEdit } from 'react-icons/ti';
import axios from 'axios';

const apiUrlDocuments = 'http://localhost:8080/documents/';

function Documents() {
	const [documents, setDocuments] = useState([]);
	const [editingFilename, setEditingFilename] = useState('');
	const [actualFilename, setActualFilename] = useState('');
	const [extensionFilename, setExtensionFilename] = useState('')

	useEffect(() => {
		getDocuments()
	}, []);

	const getDocuments = () => {
		axios
			.get(apiUrlDocuments).then((response) => {
				const formattedFiles = response.data.data.map((file) => {
					return { title: file['name'] };
				});
				setDocuments(formattedFiles);
			});
	}

	const deleteDocument = (documentTitle) => {
		axios
			.delete(apiUrlDocuments, { data: { name: documentTitle } })
			.then((response) => {
				if (response.status === 200) {
					setDocuments(documents.filter((doc) => doc.title !== documentTitle));
				}
			});
	};

	const editDocument = (oldTitle, newTitle, callback) => {
		axios
			.put(apiUrlDocuments, { oldName: oldTitle, newName: newTitle })
			.then((_) => {
				callback();
			});
	};

	const downloadFile = (filename) => {
		axios
			.get(`${apiUrlDocuments}${filename}`).then((res) => {
				const blob = new Blob([res.data], { type: 'application/pdf' })
				let link = document.createElement('a')
				link.href = window.URL.createObjectURL(blob)
				link.download = filename
				link.click()
			})
	}

	const uploadFile = (event) => {
		event.preventDefault()
		if (event.dataTransfer.items) {
			for (var i = 0; i < event.dataTransfer.items.length; i++) {
				if (event.dataTransfer.items[i].kind === 'file') {
					const file = event.dataTransfer.items[i].getAsFile()
					var formData = new FormData();
					formData.append("data", file);
					axios.post(apiUrlDocuments, formData, {
						headers: {
							"Content-Type": "multipart/form-data"
						}
					}).then((res) => {
						if (res.status == 200) {
							getDocuments()
						}
					})
				}
			}
		}
	}
	const onDragOver = (event) => {
		event.preventDefault()
		event.stopPropagation()
	}

	const onChangeFileName = (event) => {
		if (event !== null && event !== '') {
			setActualFilename(event.target.value);
		}
	};

	const editInput = (filename) => {
		setExtensionFilename(filename.slice(filename.length - 4))
		setActualFilename(filename.substring(0, filename.length - 4));
		setEditingFilename(filename)
	};

	const onEditInputKeyDown = (event) => {
		var code = event.charCode || event.keyCode;
		if (code === 27) stopEditing();
		if (code === 13) submitEditing(event);
	};

	const stopEditing = () => {
		setEditingFilename('');
	};

	const submitEditing = (event) => {
		const oldName = event.target.id
		const newName = `${event.target.value}${extensionFilename}`
		editDocument(oldName, newName, () => {
			setEditingFilename('');
			setDocuments(
				documents.map((doc) => {
					return doc.title === oldName ? { title: newName } : { title: doc.title };
				})
			);
		});
	};

	const renderFilename = (document) => {
		if (editingFilename == document.title) {
			return (
				<input
					className="text list-documents-input-item"
					value={actualFilename}
					id={document.title}
					autoFocus={true}
					onChange={(event) => onChangeFileName(event)}
					onKeyDown={(event) => onEditInputKeyDown(event)}
				/>
			);
		} else {
			return (
				<div
					onClick={() => downloadFile(document.title)}
					className="list-documents-item-name"
					id={document.title}
				>
					<span className="text">{document.title}</span>
				</div>
			);
		}
	};

	return (
		<div className="general-container">
			<div className="side left">
				<div className="link-upload-container">
					<div className="link-icon-container">
						<FaLink size="1.25rem" color="white" className="link-icon" />
					</div>
					<div className="link-upload-text-container">
						<span className="text">Adicionar o URL de um ficheiro</span>
					</div>
				</div>
				<div className="or-text-container">
					<span className="text">ou</span>
				</div>
				<div className="upload-file-container"
					onDrop={(event) => uploadFile(event)}
					onDragOver={(event) => onDragOver(event)}>
					<div className="folder-icon">
						<AiFillFolderOpen size="4.0rem" color="#0099ff" />
					</div>
					<div>
						<span className="text">Arraste e solte seus documentos</span>
					</div>
				</div>
			</div>
			<div className="side right">
				<div className="list-documents-title-container">
					<span className="list-documents-title-text text">
						Lista de documentos adicionados
					</span>
				</div>
				<div className="list-documents-container">
					{documents.map((document) => {
						return (
							<div key={document.title} className="list-documents-item">
								{renderFilename(document)}
								<BsTrashFill
									size="1.75rem"
									color="#d0d0d0"
									className="trash-icon"
									onClick={() => deleteDocument(document.title)}
									cursor="pointer"
								></BsTrashFill>
								<TiEdit
									size="1.75rem"
									color="#d0d0d0"
									onClick={() => editInput(document.title)}
									cursor="pointer"
								></TiEdit>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default Documents;
