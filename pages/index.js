import Header from '../components/Header'
import Layout from '../components/MyLayout'
// This is the Link API
import Link from 'next/link'

import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';

// SuperAgentの利用を宣言
import request from 'superagent';

// path
const path = require('path');

// JSONパス設定
// const jsonPath = path.resolve(__dirname, 'test.json');

// サムネイルコンポーネント
class Gallery extends React.Component {

  constructor(props) {
    super(props);
    // ステート初期化
    this.state = {
      items: null,
      length: 0,
      currentPage: 0,
      itemsPerPage: 0,
      totalPages: 0,
      itemWidth: 0,
      itemHeight: 0,
      topPartsWidth: null,
      topPartsHeight: null,
      screenMode: null,
    }
  }

  getWindowSize() {
    // const w = window,
    //       d = document,
    //       e = d.documentElement,
    //       g = d.getElementsByTagName('body')[0],
    //       iw = e.clientWidth || g.clientWidth || w.innerWidth,
    //       ow = w.outerWidth,
    //       bw = d.getElementById('gallery').clientWidth;

    return {
      width: 200,
      outerwidth: 1280,
      baseareawidth: 1024,
    }
  }


  // マウントされるとき
  componentWillMount () {

    // リサイズ時の最大表示数変更
    // global.addEventListener('resize', () => {
    //   var size = this.getWindowSize()
    //   this.onResize( size )
    // }, false )

    // JSONデータ読み込み
    request.get('http://temp:8100/test.json')
      .accept('application/json')
      .end( ( err, res ) => {
        this.loadedJSON( err, res )
        // console.log(res)
      })
  }

  // データを読み込んだとき
  loadedJSON ( err, res ) {
    if ( err ) {
      console.log('データ読み込みに失敗しました。'+err)
      return
    }

    // ステート更新
    this.setState({
      items: [res.body],
      length: res.body.img.length,
    })

    // windowSize取得後デバイス判定の上、最大表示数を決定
    var size = this.getWindowSize()
    this.onResize( size )

  }

  onPageChange( p ) {
    this.setState({
      currentPage: p,
    })
  }

  onResize ( size ) {

    const PC = 'PC'
    const SP = 'SP'

    // デバイス判定（PC,SP）
    if( size.outerwidth >= 600 ){

      if ( this.state.screenMode !== PC ){
        this.setState({
          currentPage: 0,
          screenMode: PC,
        })
      }

      this.setState({
        itemsPerPage: 7,
        totalPages: Math.floor( (this.state.length-1) / 8 ),
        itemWidth: (size.baseareawidth / 4) + 'px',
        itemHeight: (size.baseareawidth / 4) + 'px',
      })

    } else if ( size.outerwidth < 600 ) {

      if ( this.state.screenMode !== SP ){
        this.setState({
          currentPage: 0,
          screenMode: SP,
        })
      }

      this.setState({
        itemsPerPage: 3,
        totalPages: Math.floor( (this.state.length-1) / 4 ),
        itemWidth: (size.baseareawidth / 2) + 'px',
        itemHeight: (size.baseareawidth / 2) + 'px',
      })

    }

  }

  // 描画処理
  render () {

    if ( !this.state.items ) {
      return <div className='App'>Now Loading...</div>
    }

    // 写真サムネイル
    const photoList = this.state.items.map( ( e, index ) => {

      if ( e.result === 'NG') {

        const errStyle = {
          "letter-spacing": 'normal'
        }

        return <div className="NG" key='result_NG'>
          <p style={errStyle} key='err_msg'>{e.err_msg}</p>
          <p key='err_cd'>{e.err_cd}</p>
        </div>

      } else {

        // ページ分割用Array作成
        const items_list = e.img
        const new_items_list = []

        const b = items_list.length
        const cnt = this.state.itemsPerPage + 1

        for ( let i=0; i < Math.ceil( b / cnt ); i++) {
          let j = i * cnt
          let p = items_list.slice(j, j+cnt)
          new_items_list.push(p)
        }

        // console.log(new_items_list)

        const imgList = new_items_list[this.state.currentPage].map( ( images, index ) => {

          const styleLI = {
            "overflow": 'hidden',
            "width": this.state.itemWidth,
            "height": this.state.itemHeight,
            "margin": 0,
            "boxSizing": 'border-box',
            "padding": '0.5%',
            "display": 'block',
            "float": 'left',
          }
          const styleA = {
            "display": 'block',
            "width": '100%',
            "height": '100%',
          }

          return <div style={styleLI} key={images.cd} className="thumb" data-index={index} data-seq={images.seq}>
            <a href={images.pageurl} style={styleA} target="_blank">
              <div style={
                {
                  "backgroundImage": 'url('+images.thumblarge+')',
                  "backgroundRepeat": 'no-repeat',
                  "backgroundSize": 'cover',
                  "backgroundPosition": 'center center',
                  "width": '100%',
                  "height": '100%',
                }
              }></div>
            </a>
          </div>
        })

        return imgList
      }
    })

    // ページャー（数字部分）
    const pagination = this.state.items.map( e => {

      if ( e.result === 'NG') {

        return

      } else {

        // ページ数カウンタ
        const page_list_count = parseInt( this.state.totalPages )

        // ページリスト作成
        let list_count = 0;
        let list_row = [];

        for ( let i=0; i <= page_list_count; i++ ) {

          list_row[list_count] = i;
          list_count++;

        }

        // console.log(list_row)

        // 表示ページ抽出
        let new_list_row = []

        if ( list_row.length > 6 ){

          if ( this.state.currentPage <= list_row[2] ){
            new_list_row = list_row.slice(0,6)
          } else if ( this.state.currentPage > list_row[2] && this.state.currentPage < list_row[list_row.length-3] ) {
            new_list_row = list_row.slice(this.state.currentPage-2,this.state.currentPage+4)
          } else if ( this.state.currentPage >= list_row[list_row.length-3]) {
            new_list_row = list_row.slice(-6)
          }

        } else {
          new_list_row = list_row
        }
        // console.log(new_list_row)

        const hrefList = new_list_row.map( ( page, index ) => {

          // console.log(page,index)
          let isCurrent = {};
          let isDisabled = '';

          if ( page == this.state.currentPage ){
            isCurrent = {
                "fontWeight": 'bold',
                "color": '#000',
                "borderColor": '#fff'
            };
            isDisabled = 'disabled'
            // console.log(page)
          }

          return <a key={page} disabled={isDisabled} style={isCurrent} name={page} index={index} href='javascript:void(0)' onClick={ e => this.onPageChange( page ) }>{page+1}</a>
        })

        return <p key='p'>
          {(() => {
            if ( this.state.currentPage != 0 ){
              return <a key='prevBtn' href='javascript:void(0)' onClick={ e => this.onPageChange ( this.state.currentPage-1 ) }>前へ</a>
            }
          })()}
          {(() => {
            return hrefList
          })()}
          {(() => {
            if ( this.state.currentPage != ( this.state.totalPages ) ){
              return <a key='nextBtn' href='javascript:void(0)' onClick={ e => this.onPageChange ( this.state.currentPage+1 ) }>次へ</a>
            }
          })()}
          </p>
        }

    })

    return (
      <div key='galleryLists'>
        <div key='galleryPager' className="gallery_pager clearfix">{pagination}</div>
        <div key='galleryImageList' className='galleryTop_photoList clearfix'>{photoList}</div>
        <div key='galleryPagerBottom' className="gallery_pagerBottom">{pagination}</div>
      </div>
    )

  }

}

const PostLink = ( props ) => (
  <li>
    <Link as={`/p/${props.id}`} href={`/post?title=${props.title}`}>
      <a>{props.title}</a>
    </Link>
  </li>
)

export default () => (
  <div>
    <Gallery />
    <Layout>
       <h1>My Blog</h1>
       <ul>
         <PostLink id="hello-nextjs" title="Hello Next.js"/>
         <PostLink id="learn-nextjs" title="Learn Next.js is awesome"/>
         <PostLink id="deploy-nextjs" title="Deploy apps with Zeit"/>
       </ul>
    </Layout>
  </div>
)
