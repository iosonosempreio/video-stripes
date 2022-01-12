import classNames from "classnames";
import { useState } from "react";
import styles from "./Video.module.css";
export default function Video({ data }) {
	const bgImage = data.meta.image;
	const [expanded, setExpanded] = useState(false)
	return (
		<div className={styles.container}>
			<h6>
				<a href={data.postData.tiktok_url} target="_blank">
					{data.hash}
				</a>
				, by {data.postData.author}
			</h6>
			<div className={classNames(styles.stripe, {[styles.expanded]: expanded})} onClick={()=>setExpanded(!expanded)}>
				{Object.keys(data.frames).reverse().map((frame,i) => {
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
								backgroundPositionX:`-${f.frame.x}px`,
								backgroundPositionY:`-${f.frame.y}px`
							}}
						/>
					);
				})}
			</div>
			<p>
				Plays <span>{data.postData.plays}</span> – Likes{" "}
				<span>{data.postData.likes}</span> – Author followers{" "}
				<span>{data.postData.author_followers}</span> – Hashtags: <span>{data.postData.hashtags}</span>
			</p>
		</div>
	);
}
