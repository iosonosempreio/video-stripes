import classNames from "classnames";
import { useState } from "react";
import styles from "./Video.module.css";
import domtoimage from "dom-to-image";

export default function Video({ data }) {
	const bgImage = data.meta.image;
	const [expanded, setExpanded] = useState(false);

	function printDiv(div, hash) {
		div.classList.add(styles.forScreenshot);
		domtoimage.toPng(div).then((imgData) => {
			console.log(imgData);
			downloadURI(imgData, `${hash}.png`);
			div.classList.remove(styles.forScreenshot);
		});
	}

	function downloadURI(uri, name) {
		const prevLink = document.querySelector("a.for-download");
		if (prevLink) {
			prevLink.remove();
		}
		var link = document.createElement("a");
		link.classList.add(".for-download");
		link.download = name;
		link.href = uri;
		document.body.appendChild(link);
		link.click();
	}
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<span className="mr-3">
					<a href={data.postData.tiktok_url} target="_blank">
						{data.hash}
					</a>
					, by {data.postData.author}
				</span>
				<span className="mx-3">
					{data.postData.plays} plays - {data.postData.likes} likes -{" "}
					{data.postData.author_followers} account followers.
				</span>
				<span className="mx-3">
					<span>Hashtags: {data.postData.hashtags.split(",").join(", ")}</span>
				</span>
				<span
					className={classNames("ml-3", styles.saveBtn, "badge bg-dark")}
					onClick={function (event) {
						const div = event.target.parentNode.parentNode;
						printDiv(div, data.hash);
					}}
				>
					Save
				</span>
			</div>
			<div
				className={classNames(styles.stripe, { [styles.expanded]: expanded })}
				onClick={() => setExpanded(!expanded)}
			>
				{Object.keys(data.frames)
					.reverse()
					.map((frame, i) => {
						const f = data.frames[frame];
						return (
							<div
								key={i}
								data-index={i}
								data-frame={frame}
								className={styles.frame}
								style={{
									width: f.frame.w,
									height: f.frame.h,
									backgroundImage: `url(${process.env.PUBLIC_URL}/assets/${bgImage})`,
									backgroundPositionX: `-${f.frame.x}px`,
									backgroundPositionY: `-${f.frame.y}px`,
								}}
							/>
						);
					})}
			</div>
		</div>
	);
}
