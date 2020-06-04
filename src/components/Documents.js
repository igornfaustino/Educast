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
	const [editingUrl, setEditingUrl] = useState('')
	const [isEditingUrl, setIsEditingUrl] = useState(false)

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
		window.open(`${apiUrlDocuments}${filename}`)
	}

	const uploadFile = (event) => {
		event.preventDefault()
		if (event.dataTransfer.items) {
			for (var i = 0; i < event.dataTransfer.items.length; i++) {
				if (event.dataTransfer.items[i].kind === 'file') {
					const file = event.dataTransfer.items[i].getAsFile()
					upload(file)
				}
			}
		}
	}

	const upload = (file) => {
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


	const onDragOver = (event) => {
		event.preventDefault()
		event.stopPropagation()
	}

	const onChangeFileName = (event) => {
		if (event !== null && event !== '') {
			setActualFilename(event.target.value);
		}
	};

	const onChangeUrl = (event) => {
		if (event !== null && event !== '') {
			setEditingUrl(event.target.value);
		}
	};

	const editInput = (filename) => {
		setExtensionFilename(filename.slice(filename.length - 4))
		setActualFilename(filename.substring(0, filename.length - 4));
		setEditingFilename(filename)
	};

	const editUrl = (filename) => {
		setEditingUrl('');
		setIsEditingUrl(true)
	};

	const onEditInputKeyDown = (event) => {
		var code = event.charCode || event.keyCode;
		if (code === 27) stopEditing();
		if (code === 13) submitEditing(event);
	};

	const onEditUrlKeydown = (event) => {
		var code = event.charCode || event.keyCode;
		if (code === 27) stopEditingUrl();
		if (code === 13) submitEditingUrl(event);
	};

	const stopEditing = () => {
		setEditingFilename('');
	};

	const stopEditingUrl = () => {
		setIsEditingUrl(false);
	};

	const submitEditingUrl = (event) => {
		const url = event.target.value
		fetch(url).then((res) => {
			const header =  res.headers.get('Content-Disposition')
			if(!header) return

			const filename = header.match(/"([^']+)"/)[1]
			res.blob().then((resBlob) => {
				const file = new File([resBlob], filename)
				upload(file)
			})
		})
		setIsEditingUrl(false)
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
		if (editingFilename === document.title) {
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

	const renderAddByUrl = () => {
		if (isEditingUrl) {
			return (
				<input
					className="link-upload-container"
					value={editingUrl}
					autoFocus={true}
					onChange={(event) => onChangeUrl(event)}
					onKeyDown={(event) => onEditUrlKeydown(event)}
				/>
			)
		} else {
			return (
				<div
					className="link-upload-text-container link-upload-container"
					onClick={() => editUrl()}
				>
					<span className="text">Adicionar o URL de um ficheiro</span>
				</div>
			)
		}
	}

	return (
		<div className="general-container">
			<div className="side left">
				<div className="link-upload-container">
					<div className="link-icon-container">
						<FaLink size="1.25rem" color="white" className="link-icon" />
					</div>
					{renderAddByUrl()}
				</div>
				<div className="or-text-container">
					<span className="text">ou</span>
				</div>
				<div className="upload-file-container"
					onDrop={(event) => uploadFile(event)}
					onDragOver={(event) => onDragOver(event)}>
					<div className="folder-icon">
						<AiFillFolderOpen size="3.0rem" color="#0099ff" />
					</div>
					<span className="text text-center">Arraste e solte seus documentos</span>
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
								/>
								<TiEdit
									size="1.75rem"
									color="#d0d0d0"
									onClick={() => editInput(document.title)}
									cursor="pointer"
								/>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default Documents;
