{this.state.isLoggedIn ?

          
          <View style={styles.container}>

            <TouchableOpacity style={styles.stickyHeader}>
              <Text style={styles.txtstickyHeader}>Verifikasi No Hp kamu disini</Text>
            </TouchableOpacity>

            <View style={{ alignItems: 'center', marginBottom: 10 }}>
              <View style={{ marginBottom: 20 }}>
                <Image style={styles.avatarBig} source={{ uri: this.state.avatar }} />
              </View>
              {/*<View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={styles.activitydetailTitle}>{this.state.name}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={styles.textCart}>Edit Profile</Text>
                  <View style={{ marginHorizontal: 10 }}>
                    <Text style={styles.textCart}>|</Text>
                  </View>
                  <Text style={styles.textCartColor}>100 point</Text>
                </View>
              </View>*/}
            </View>
            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#efefef', paddingBottom: 15, marginBottom: 15 }}>
              <View style={{ justifyContent: 'center', flex: 2 }}>
                <Text style={styles.optionProfile}>{profile.name}</Text>
              </View>
              <TouchableOpacity style={{ alignItems: 'flex-end', flex: 1 }}>
                {/* <Icon
                  name='ios-settings-outline'
                  type='ionicon'
                  size={30}
                  color='#454545' /> */}
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#efefef', paddingBottom: 15, marginBottom: 15 }}>
              <View style={{ justifyContent: 'center', flex: 2 }}>
                <Text style={styles.optionProfile}>{profile.email}</Text>
              </View>
              <TouchableOpacity style={{ alignItems: 'flex-end', flex: 1 }}>
                {/* <Icon
                  name='ios-settings-outline'
                  type='ionicon'
                  size={30}
                  color='#454545' /> */}
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#efefef', paddingBottom: 15, marginBottom: 15 }}>
              <View style={{ justifyContent: 'center', flex: 2 }}>
                <Text style={styles.optionProfile}>+{profile.countryCallCd} {profile.phone}</Text>
              </View>
              <TouchableOpacity style={{ alignItems: 'flex-end', flex: 1 }}>
                {/* <Icon
                  name='ios-settings-outline'
                  type='ionicon'
                  size={30}
                  color='#454545' /> */}
              </TouchableOpacity>
            </View>
            {/* <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#efefef', paddingBottom: 15, marginBottom: 15 }}>
              <View style={{ justifyContent: 'center', flex: 1 }}>
                <Text style={styles.optionProfile}>{this.state.name}</Text>
              </View>
              <TouchableOpacity style={{ alignItems: 'flex-end', flex: 1 }}>
                <Icon
                  name='ios-settings-outline'
                  type='ionicon'
                  size={30}
                  color='#454545' />
              </TouchableOpacity>
            </View>

            {/*<View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#efefef', paddingBottom: 15, marginBottom: 15 }}>
              <View style={{ justifyContent: 'center', flex: 1 }}>
                <Text style={styles.optionProfile}>Notifikasi</Text>
              </View>
              <View style={{ alignItems: 'flex-end', flex: 1 }}>
                <Icon
                  name='ios-notifications-outline'
                  type='ionicon'
                  size={30}
                  color='#454545' />
              </View>
            </View>
            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#efefef', paddingBottom: 15, marginBottom: 15 }}>
              <View style={{ justifyContent: 'center', flex: 1 }}>
                <Text style={styles.optionProfile}>Undang Teman</Text>
              </View>
              <View style={{ alignItems: 'flex-end', flex: 1 }}>
                <Icon
                  name='ios-profiles-outline'
                  type='ionicon'
                  size={30}
                  color='#454545' />
              </View>
            </View>
            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#efefef', paddingBottom: 15, marginBottom: 15 }}>
              <View style={{ justifyContent: 'center', flex: 1 }}>
                <Text style={styles.optionProfile}>Pembayaran</Text>
              </View>
              <View style={{ alignItems: 'flex-end', flex: 1 }}>
                <Icon
                  name='ios-cash-outline'
                  type='ionicon'
                  size={30}
                  color='#454545' />
              </View>
            </View>
            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#efefef', paddingBottom: 15, marginBottom: 15 }}>
              <View style={{ justifyContent: 'center', flex: 1 }}>
                <Text style={styles.optionProfile}>Pengaturan</Text>
              </View>
              <View style={{ alignItems: 'flex-end', flex: 1 }}>
                <Icon
                  name='ios-settings-outline'
                  type='ionicon'
                  size={30}
                  color='#454545' />
              </View>
            </View>*/}

            <View style={{ borderBottomWidth: 1, borderBottomColor: '#efefef', paddingBottom: 15, marginBottom: 15 }}>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={this._goToReferral}>
                <View style={{ justifyContent: 'center', flex: 2 }}>
                  <Text style={styles.optionProfile}>Undang Teman</Text>
                </View>
                <View style={{ alignItems: 'flex-end', flex: 1 }}>
                  <Icon
                    name='ios-contacts'
                    type='ionicon'
                    size={30}
                    color='#454545' />
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ borderBottomWidth: 1, borderBottomColor: '#efefef', paddingBottom: 15, marginBottom: 15 }}>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={this._openModal}>
                <View style={{ justifyContent: 'center', flex: 2 }}>
                  <Text style={styles.optionProfile}>Log Out</Text>
                </View>
                <View style={{ alignItems: 'flex-end', flex: 1 }}>
                  <Icon
                    name='ios-log-out'
                    type='ionicon'
                    size={30}
                    color='#454545' />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          :
          <View style={styles.container}>
            <View style={{ borderBottomWidth: 1, borderBottomColor: '#efefef', paddingBottom: 15, marginBottom: 15 }}>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => navigate('LoginScreen', { resetAfter: true })}>
                <View style={{ justifyContent: 'center', flex: 2 }}>
                  <Text style={styles.optionProfile}>Login</Text>
                </View>
                <View style={{ alignItems: 'flex-end', flex: 1 }}>
                  <Icon
                    name='ios-log-in'
                    type='ionicon'
                    size={30}
                    color='#454545' />
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ borderBottomWidth: 1, borderBottomColor: '#efefef', paddingBottom: 15, marginBottom: 15 }}>
              <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => navigate('Registration', { resetAfter: true })}>
                <View style={{ justifyContent: 'center', flex: 2 }}>
                  <Text style={styles.optionProfile}>Daftar</Text>
                </View>
                <View style={{ alignItems: 'flex-end', flex: 1 }}>
                  <Icon
                    name='ios-laptop'
                    type='ionicon'
                    size={30}
                    color='#454545' />
                </View>
              </TouchableOpacity>
            </View>
            
          </View>
        }