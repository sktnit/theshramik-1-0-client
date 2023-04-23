import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import constants from '../../../constants/constants'

const useStyles = makeStyles((theme) => ({
  imageContainer: {
    maxWidth: '100%',
    display: 'flex'
  },
  positionRelative: {
    position: 'relative'
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    borderRadius: '8px'
  },
  bottomCenterText: {
    position: 'absolute',
    bottom: '5px',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: theme.palette.fontWeight.Book,
    fontFamily: 'Rubik'
  },
  creditTextBG: {
    height: '28px',
    bottom: '0',
    // opacity: '0.4',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4);',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  textLower: {
    textTransform: 'lowercase'
  },
  linkText: {
    color: '#ffffff',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  }
}))

function ImageView (props) {
  const classes = useStyles()
  const src = props.src
  const srcIsVideo = src && typeof src !== 'object' && src.includes('missionvideo')
  const srcIsUnsplash = props.uploadFrom && props.uploadFrom === constants.IMAGE_TYPE.UNSPLASH
  return (
    <div>
      {srcIsVideo
        ? (
          <div className={classes.imageContainer}>
            <video className={classes.imageContainer} src={src} controls />
          </div>
          )
        : srcIsUnsplash
          ? (
            <div className={classes.imageContainer}>
              <div className={classes.positionRelative}>
                <img src={src} className={`${classes.image}`} />
                <div className={`${classes.bottomCenterText} ${classes.creditTextBG}`}>
                  {props.unsplashImageCredit && typeof props.unsplashImageCredit === 'string'
                    ? (
                    <>
                      Photo by&nbsp;
                      <a
                        href={`${process.env.REACT_APP_UNSPLASH_ENDPOINT}/@${props.unsplashImageUserName ? props.unsplashImageUserName : ''}?utm_source=swae&utm_medium=referral`}
                        target="_blank"
                        className={classes.linkText}
                        rel="noreferrer">
                        <span className={classes.textLower}>
                          {props.unsplashImageCredit.length > 16 ? props.unsplashImageCredit.substring(0, 15) + '...' : props.unsplashImageCredit}
                        </span>
                      </a>
                      &nbsp;on&nbsp;
                      <a href={`${process.env.REACT_APP_UNSPLASH_ENDPOINT}/?utm_source=swae&utm_medium=referral`} target="_blank" className={classes.linkText} rel="noreferrer">
                        Unsplash
                      </a>
                    </>
                      )
                    : (
                    <>
                      Photo on&nbsp;
                      <a href={`${process.env.REACT_APP_UNSPLASH_ENDPOINT}/?utm_source=swae&utm_medium=referral`} target="_blank" className={classes.linkText} rel="noreferrer">
                        Unsplash
                      </a>
                    </>
                      )}
                </div>
              </div>
            </div>
            )
          : (src && <div className={classes.imageContainer}>
              <img src={src} className={classes.image} />
            </div>
            )}
    </div>
  )
}

ImageView.propTypes = {
  unsplashImageUserName: PropTypes.string,
  unsplashImageCredit: PropTypes.string,
  uploadFrom: PropTypes.string,
  src: PropTypes.string
}

export default memo(ImageView)
