import styles from "./Video.module.css";
export default function Video({ data }) {
	const bgImage = data.meta.image;
	return (
		<>
			<h6>
				<a href={data.postData.tiktok_url} target="_blank">
					{data.hash}
				</a>
				, by {data.postData.author}
			</h6>
			<div className={styles.stripe}>
				{Object.keys(data.frames).map((frame) => {
					const f = data.frames[frame];
					return (
						<div
							key={frame}
							data-frame={frame}
							className={styles.frame}
							style={{
								width: f.frame.w,
								height: f.frame.h,
								backgroundImage: `url(${process.env.PUBLIC_URL}/assets/${bgImage})`,
							}}
						/>
					);
				})}
			</div>
			<p className="mb-5">
				Plays <span>{data.postData.plays}</span> – Likes{" "}
				<span>{data.postData.likes}</span> – Author followers{" "}
				<span>{data.postData.author_followers}</span>
			</p>
		</>
	);
}
