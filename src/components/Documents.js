import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styles from './Documents.module.scss';
import { FaLink } from 'react-icons/fa';
import { AiFillFolderOpen } from 'react-icons/ai';
import { BsTrashFill } from 'react-icons/bs';
import { TiEdit } from 'react-icons/ti';
import axios from 'axios';
import cx from 'classnames';

const apiUrlDocuments = 'http://localhost:8080/documents/';

function Documents() {
	const [documents, setDocuments] = useState([]);
	const [editingFilename, setEditingFilename] = useState('');
	const [actualFilename, setActualFilename] = useState('');
	const [extensionFilename, setExtensionFilename] = useState('')
	const [editingUrl, setEditingUrl] = useState('')
	const [isEditingUrl, setIsEditingUrl] = useState(false)

	const getDocuments = useCallback(() => {
		axios
			.get(apiUrlDocuments).then((response) => {
				const formattedFiles = response.data.data.map((file) => {
					return { title: file['name'] };
				});
				setDocuments(formattedFiles);
			}).catch(_ => {
				alert("Ocorreu um erro tentando obter os documentos")
			});
	}, []);

	useEffect(() => {
		getDocuments()
	}, [getDocuments]);

	const deleteDocument = useCallback((documentTitle) => {
		axios
			.delete(apiUrlDocuments, { data: { name: documentTitle } })
			.then((response) => {
				if (response.status === 200) {
					setDocuments(documents.filter((doc) => doc.title !== documentTitle));
				} else {
					alert("Ocorreu um erro ao deletar o documento")
				}
			}).catch(_ => {
				alert("Ocorreu um erro ao deletar o documento")

			})
	}, [documents]);

	const editDocument = useCallback((oldTitle, newTitle, callback) => {
		axios
			.put(apiUrlDocuments, { oldName: oldTitle, newName: newTitle })
			.then((res) => {
				if (res.status === 200) {
					callback();
				} else {
					alert("Ocorreu um erro ao editar o documento")
				}
			}).catch(_ => {
				alert("Ocorreu um erro ao editar o documento")
			});
	}, []);

	const downloadFile = useCallback((filename) => {
		window.open(`${apiUrlDocuments}${filename}`)
	}, []);

	const upload = useCallback((file) => {
		var formData = new FormData();
		formData.append("data", file);
		axios.post(apiUrlDocuments, formData, {
			headers: {
				"Content-Type": "multipart/form-data"
			}
		}).then((res) => {
			if (res.status === 200) {
				getDocuments()
			} else {
				alert("Ocorreu um erro ao fazer upload do documento")
			}
		}).catch(_ => {
			alert("Ocorreu um erro ao fazer upload do documento")
		})
	}, [getDocuments]);

	const uploadFile = useCallback((event) => {
		event.preventDefault()
		if (event.dataTransfer.items) {
			for (var i = 0; i < event.dataTransfer.items.length; i++) {
				if (event.dataTransfer.items[i].kind === 'file') {
					const file = event.dataTransfer.items[i].getAsFile()
					upload(file)
				}
			}
		}
	}, [upload]);

	const onDragOver = useCallback((event) => {
		event.preventDefault()
		event.stopPropagation()
	}, []);

	const onChangeFileName = useCallback((event) => {
		if (event !== null && event !== '') {
			setActualFilename(event.target.value);
		}
	}, []);

	const onChangeUrl = useCallback((event) => {
		if (event !== null && event !== '') {
			setEditingUrl(event.target.value);
		}
	}, []);

	const editInput = useCallback((filename) => {
		setExtensionFilename(filename.slice(filename.length - 4))
		setActualFilename(filename.substring(0, filename.length - 4));
		setEditingFilename(filename)
	}, []);

	const editUrl = useCallback((filename) => {
		setEditingUrl('');
		setIsEditingUrl(true)
	}, []);

	const stopEditing = useCallback(() => {
		setEditingFilename('');
	}, []);

	const submitEditing = useCallback((event) => {
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
	}, [documents, editDocument, extensionFilename]);

	const onEditInputKeyDown = useCallback((event) => {
		var code = event.charCode || event.keyCode;
		if (code === 27) stopEditing();
		if (code === 13) submitEditing(event);
	}, [stopEditing, submitEditing]);

	const stopEditingUrl = useCallback(() => {
		setIsEditingUrl(false);
	}, []);

	const submitEditingUrl = useCallback((event) => {
		const url = event.target.value
		fetch(url).then((res) => {
			const header = res.headers.get('Content-Disposition')
			if (!header) {
				alert('Link inválido')
				return
			}

			const filename = header.match(/"([^']+)"/)[1]
			res.blob().then((resBlob) => {
				const file = new File([resBlob], filename)
				upload(file)
			})
		}).catch((_) => {
			alert('Não foi possível acessar o URL')
		})
		setIsEditingUrl(false)
	}, [upload]);

	const onEditUrlKeydown = useCallback((event) => {
		var code = event.charCode || event.keyCode;
		if (code === 27) stopEditingUrl();
		if (code === 13) submitEditingUrl(event);
	}, [stopEditingUrl, submitEditingUrl]);

	const renderFilename = useCallback((document) => {
		if (editingFilename === document.title) {
			return (
				<input
					className={cx(styles["text"], styles["list-documents-input-item"])} //"text list-documents-input-item"
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
					className={styles["list-documents-item-name"]}
					id={document.title}
				>
					<span className={styles["text"]}>{document.title}</span>
				</div>
			);
		}
	}, [actualFilename, downloadFile, editingFilename, onChangeFileName, onEditInputKeyDown]);

	const renderAddByUrl = useMemo(() => {
		if (isEditingUrl) {
			return (
				<input
					className={styles["link-upload-container"]}
					value={editingUrl}
					autoFocus={true}
					onChange={(event) => onChangeUrl(event)}
					onKeyDown={(event) => onEditUrlKeydown(event)}
				/>
			)
		} else {
			return (
				<div
					className={cx(styles["link-upload-text-container"], styles["link-upload-container"])}
					onClick={() => editUrl()}
				>
					<span className={styles["text"]}>Adicionar o URL de um ficheiro</span>
				</div>
			)
		}
	}, [editUrl, editingUrl, isEditingUrl, onChangeUrl, onEditUrlKeydown]);

	const renderFiles = useMemo(() => {
		return documents.map((document) => {
			return (
				<div key={document.title} className={styles["list-documents-item"]}>
					{renderFilename(document)}
					<BsTrashFill
						size="1.75rem"
						color="#d0d0d0"
						className={styles["trash-icon"]}
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
		})
	}, [documents, deleteDocument, editInput, renderFilename]);

	return (
		<div className={styles["general-container"]}>
			<div className={cx(styles["side"], styles["left"])}>
				<div className={styles["link-upload-container"]}>
					<div className={styles["link-icon-container"]}>
						<FaLink size="1.25rem" color="white" className={styles["link-icon"]} />
					</div>
					{renderAddByUrl}
				</div>
				<div className={styles["or-text-container"]}>
					<span className={styles["text"]}>ou</span>
				</div>
				<div className={styles["upload-file-container"]}
					onDrop={(event) => uploadFile(event)}
					onDragOver={(event) => onDragOver(event)}>
					<div className={styles["folder-icon"]}>
						<AiFillFolderOpen size="3.0rem" color="#0099ff" />
					</div>
					<span className={cx(styles["text"], styles["text-center"])}>Arraste e solte seus documentos</span>
				</div>
			</div>
			<div className={cx(styles["side"],  styles["right"])}>
				<div className={styles["list-documents-title-container"]}>
					<span className={cx(styles["list-documents-title-text"], styles["text"])}>
						Lista de documentos adicionados
					</span>
				</div>
				<div className={styles["list-documents-container"]}>
					{renderFiles}
				</div>
			</div>
		</div>
	);
}

export default Documents;
