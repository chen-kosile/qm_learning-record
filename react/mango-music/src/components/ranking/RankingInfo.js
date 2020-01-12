import React from "react"
import { CSSTransition } from "react-transition-group"
import Header from "@/common/header/Header"
import Scroll from "@/common/scroll/Scroll"
import Loading from "@/common/loading/Loading"
import MusicalNote from "@/common/note/MusicalNote"
import { getRankingInfo } from "@/api/ranking"
import { getSongVKey } from "@/api/song"
import { CODE_SUCCESS } from "@/api/config"
import * as RankingModel from "@/model/ranking"
import * as SongModel from "@/model/song"

import "./rankinginfo.styl"

class RankingInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      loading: true,
      ranking: {},
      songs: [],
      refreshScroll: false
    }
  }
  componentDidMount() {
    this.setState({
      show: true
    });
    this.rankingContainerDOM.style.top = this.rankingBgDOM.offsetHeight + "px";
  }
  getRankingInfo() {
    getRankingInfo(this.props.match.params.id).then((res) => {
      // console.log("获取排行榜详情：");
      if (res) {
        // console.log(res);
        if (res.code === CODE_SUCCESS) {
          let ranking = RankingModel.createRankingByDetail(res.topinfo);
          ranking.info = res.topinfo.info;
          let songList = [];
          res.songlist.forEach(item => {
            if (item.data.pay.payplay === 1) { return }
            let song = SongModel.createSong(item.data);
            // 获取歌曲vkey
            this.getSongUrl(song, item.data.songmid);
            songList.push(song);
          });

          this.setState({
            loading: false,
            ranking: ranking,
            songs: songList
          }, () => {
            // 刷新scroll
            this.setState({ refreshScroll: true });
          });
        }
      }
    });
  }
  getSongUrl(song, mId) {
    getSongVKey(mId).then((res) => {
      if (res) {
        if (res.code === CODE_SUCCESS) {
          if (res.data.items) {
            let item = res.data.items[0];
            song.url = `http://dl.stream.qqmusic.qq.com/${item.filename}?vkey=${item.vkey}&guid=3655047200&fromtag=66`
          }
        }
      }
    });
  }
  /**
   * 选择歌曲
   */
  selectSong(song) {
    return (e) => {
      this.props.setSongs([song]);
      this.props.changeCurrentSong(song);
      this.musicalNote.startAnimation({
        x: e.nativeEvent.clientX,
        y: e.nativeEvent.clientY
      });
    };
  }
  /**
   * 播放全部
   */
  playAll = () => {
    if (this.state.songs.length > 0) {
      // 添加播放歌曲列表
      this.props.setSongs(this.state.songs);
      this.props.changeCurrentSong(this.state.songs[0]);
      this.props.showMusicPlayer(true);
    }
  }
  /**
   * 监听scroll
   */
  scroll = ({ y }) => {
    let rankingBgDOM = this.rankingBgDOM;
    let rankingFixedBgDOM = this.rankingFixedBgDOM;
    let playButtonWrapperDOM = this.playButtonWrapperDOM;
    if (y < 0) {
      if (Math.abs(y) + 55 > rankingBgDOM.offsetHeight) {
        rankingFixedBgDOM.style.display = "block";
      } else {
        rankingFixedBgDOM.style.display = "none";
      }
    } else {
      let transform = `scale(${1 + y * 0.004}, ${1 + y * 0.004})`;
      rankingBgDOM.style["webkitTransform"] = transform;
      rankingBgDOM.style["transform"] = transform;
      playButtonWrapperDOM.style.marginTop = `${y}px`;
    }
  }
  render() {
    let ranking = this.state.ranking;
    let imgStyle = {};
    if (ranking.img) {
      imgStyle.backgroundImage = `url(${ranking.img})`;
    }
    let songs = this.state.songs.map((song, index) => {
      return (
        <div className="song" key={song.id} onClick={this.selectSong(song)}>
          <div className="song-index">{index + 1}</div>
          <div className="song-name">{song.name}</div>
          <div className="song-singer">{song.singer}</div>
        </div>
      );
    });
    return (
      <CSSTransition in={this.state.show} timeout={300} classNames="translate"
        onEntered={ () => {
          // 进入动画结束后获取数据再渲染，避免大数量渲染造成动画卡顿
          this.getRankingInfo();
        }}>
        <div className="ranking-info">
          <Header title={ranking.title}></Header>
          <div style={{ position: "relative" }}>
            <div ref={(el) => { this.rankingBgDOM = el; }} className="ranking-img" style={imgStyle}>
              <div className="filter"></div>
            </div>
            <div ref={(el) => { this.rankingFixedBgDOM = el; }} className="ranking-img fixed" style={imgStyle}>
              <div className="filter"></div>
            </div>
            <div className="play-wrapper" ref={(el) => { this.playButtonWrapperDOM = el; }}>
              <div className="play-button" onClick={this.playAll}>
                <i className="icon-play"></i>
                <span>播放全部</span>
              </div>
            </div>
          </div>
          <div ref={(el) => { this.rankingContainerDOM = el; }} className="ranking-container">
            <div className="ranking-scroll" style={this.state.loading === true ? { display: "none" } : {}}>
              <Scroll refresh={this.state.refreshScroll} onScroll={this.scroll}>
                <div className="ranking-wrapper skin-detail-wrapper">
                  <div className="ranking-count">排行榜 共{songs.length}首</div>
                  <div className="song-list">
                    {songs}
                  </div>
                  <div className="info" style={ranking.info ? {} : { display: "none" }}>
                    <h1 className="ranking-title">简介</h1>
                    <div className="ranking-desc" dangerouslySetInnerHTML={{__html: ranking.info}}>
                    </div>
                  </div>
                </div>
              </Scroll>
            </div>
            <Loading title="正在加载..." show={this.state.loading} />
          </div>
          <MusicalNote ref={(el) => { this.musicalNote = el; }}/>
        </div>
      </CSSTransition>
    );
  }
}

export default RankingInfo
