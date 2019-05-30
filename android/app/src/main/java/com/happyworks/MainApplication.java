package com.happyworks;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.amazonaws.amplify.pushnotification.RNPushNotificationPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.github.wuxudong.rncharts.MPAndroidChartPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.bugsnag.BugsnagReactNative;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.react.bridge.ReadableNativeArray;
import com.facebook.react.bridge.ReadableNativeMap;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNPushNotificationPackage(),
            new RNFetchBlobPackage(),
            new PickerPackage(),
            new NetInfoPackage(),
            new MPAndroidChartPackage(),
            new AsyncStoragePackage(),
            BugsnagReactNative.getPackage(),
                  new RNGestureHandlerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    ReadableNativeArray.setUseNativeAccessor(true);
    ReadableNativeMap.setUseNativeAccessor(true);
  }
}
